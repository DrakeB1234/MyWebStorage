using System.Net;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.StaticFiles;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using api.Models;
using api.Helpers;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController: ControllerBase
    {
        // Get config from appsettings
        private readonly IConfiguration config;
        
        private readonly string rootPath;
        private readonly TimeSpan ImageCacheTimeDays;
        private readonly double ImageCacheTimeSeconds;
        
        public FilesController()
        {
            // Get Config
            this.config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            this.rootPath = config.GetValue<string>("FileUploadPath");

            // Convert cache time into days, then seconds
            this.ImageCacheTimeDays = TimeSpan.FromDays(config.GetValue<int>("ImageCacheTimeDays"));
            this.ImageCacheTimeSeconds = this.ImageCacheTimeDays.TotalSeconds;
        }
        
        [HttpGet("GetAllFilePaths/{_paramspath?}")]
        public IActionResult GetAllFilePaths(string? _paramspath)
        {
            List<FileModel> fileList = new List<FileModel>();

            // Decode url encoding from _parampath to make readable by code
            _paramspath = WebUtility.UrlDecode(_paramspath);

            var getPath = rootPath + "/" + _paramspath;

            // Used to determine file type
            var provider = new FileExtensionContentTypeProvider();
     
            // LINQ
            var fileNames = from filePath in Directory.GetFiles(getPath, "*", SearchOption.TopDirectoryOnly)
                let filename = Path.GetFileName(filePath)
                select filename;

            var imageExtensions = config.GetSection("ImageExtensions").Get<List<string>>();
            var videoExtensions = config.GetSection("VideoExtensions").Get<List<string>>();

            foreach (var item in fileNames)
            {
                var fileInfo = new FileInfo(getPath + "/" + item);
                var fileExtension = fileInfo.Extension.ToLower();

                // Check what type of file
                if (imageExtensions.Contains(fileExtension))
                {
                    fileExtension = "image";
                }
                else if (videoExtensions.Contains(fileExtension))
                {
                    fileExtension = "video";
                }
                else {
                    fileExtension = "file";
                }

                fileList.Add(new FileModel { 
                    FileName = item, 
                    FileLength = fileInfo.Length, 
                    FileType = fileExtension,
                    FileCreationDate = fileInfo.CreationTime,
                    FileDirectoryName = fileInfo.DirectoryName,
                });
            }

            // Prevent errors on Angular HttpClient by ensuring response is in JSON
            return Ok(new { Files = fileList });
        }

        // FIX THIS, temp fix to allow frontend to make req as <img> src tags do not allow headers for auth
        // Potential solution, use blob urls for frontend (PITA)
        [AllowAnonymous]
        [HttpGet("GetFullImage/{_paramspath}")]
        public IActionResult GetFullImage(string _paramspath)
        {
            // Decode url encoding from _parampath to make readable by code
            _paramspath = WebUtility.UrlDecode(_paramspath);

            var image = System.IO.File.OpenRead(rootPath + "/" + _paramspath);

            return File(image, "image/jpeg", _paramspath);
        }

        [AllowAnonymous]
        [HttpGet("GetCompressedImage/{_paramspath}")]
        public IActionResult GetCompressedImage(string _paramspath)
        {
            // Decode url encoding from _parampath to make readable by code
            _paramspath = WebUtility.UrlDecode(_paramspath);

            var loadImagePath = rootPath + "/" + _paramspath;

            var encoder = new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder
            {
                Quality = 40
            };

            try
            {
                // Using automatically closes streams when done, this prevents the image from locking up and not being able to be
                // modified once ran through this code
                using (var imageStream = new FileStream(loadImagePath, FileMode.Open, FileAccess.Read))
                {
                    // Load the image from the file stream
                    using (var image = Image.Load(imageStream))
                    {
                        // Save the processed image to a memory stream
                        using (var outputStream = new MemoryStream())
                        {
                            // Save the compressed image to the memory stream
                            image.Save(outputStream, encoder);

                            // Add cache header to improve load times on client 
                            Response.Headers.Add("Cache-Control", $"public,max-age={ImageCacheTimeSeconds}");
                            Response.Headers.Add("Expires", DateTime.UtcNow.Add(ImageCacheTimeDays).ToString("R"));
                            Response.Headers.Add("Pragma", "cache");

                            // Return the compressed image as a file
                            return File(outputStream.ToArray(), "image/jpeg", _paramspath);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error processing image: {ex.Message}" });
            }
        }

        [HttpPost("AddFile")]
        public IActionResult AddFile([FromForm] UploadFile fileData)
        {            
            var res = new UploadHandler().UploadFile(fileData);

            // Read response from helper to determine type of response
            switch (res.Status)
            {
                case 200:
                    return Ok(new { message = res.Message });
                case 400: 
                    return BadRequest(new { message = res.Message });
                default:
                    return StatusCode(res.Status, new { message = res.Message });
            }
        }

        [HttpPatch("MoveFile")]
        public IActionResult MoveFile([FromForm] MoveFile fileData)
        {            
            return Ok(new { message = fileData });
        }

        [HttpGet("DownloadFile/{downloadPath}")]
        public IActionResult DownloadFile(string downloadPath)
        {            
            // Decode url encoding from _parampath to make readable by code
            downloadPath = WebUtility.UrlDecode(downloadPath);
            var checkPath = rootPath + $"/{downloadPath}";

            // Check if file exists
            if (System.IO.File.Exists(checkPath))
            {
                var image = System.IO.File.OpenRead(rootPath + $"/{downloadPath}");

                return File(image, "image/jpeg", downloadPath);
            }
            else
            {
                return NotFound(new { message = "File does not exist" });
            }
        }

        [HttpDelete("DeleteFile")]
        public IActionResult DeleteFile([FromBody] DownloadFileModel downloadPath)
        {            
            // Decode url encoding from _parampath to make readable by code
            var checkPath = rootPath + $"/{downloadPath.FileName}";

            // Check if file exists
            if (System.IO.File.Exists(checkPath))
            {
                try
                {
                    System.IO.File.Delete(checkPath);
                    return Ok(new { message = "File deleted successfully." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = $"Error deleting file: {ex.Message}" });
                }
            }
            else
            {
                return NotFound(new { message = "File does not exist" });
            }        
        }
    }
}