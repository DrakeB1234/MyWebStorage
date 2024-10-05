using System.Net;
using System.Drawing;
using System.Drawing.Imaging;
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
        
        public FilesController()
        {
            // Get Config
            this.config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            this.rootPath = config.GetValue<string>("FileUploadPath");
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

            return File(image, "image/jpeg");
        }

        [AllowAnonymous]
        [HttpGet("GetCompressedImage/{_paramspath}")]
        public IActionResult GetCompressedImage(string _paramspath)
        {
            // Decode url encoding from _parampath to make readable by code
            _paramspath = WebUtility.UrlDecode(_paramspath);

            var loadImage = System.IO.File.OpenRead(rootPath + "/" + _paramspath);

            using var image = Image.Load(loadImage);

            // Create a new memory stream to hold the compressed image
            var outputStream = new MemoryStream();

            // Set the encoder options for JPEG compression
            // Sets quality to half
            var encoder = new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder
            {
                Quality = 40
            };

            // Save the image to the output stream with compression
            image.Save(outputStream, encoder);
            outputStream.Position = 0; // Reset the stream position to the beginning

            return File(outputStream, "image/jpeg");
        }

        [HttpPost("AddFiles")]
        public IActionResult AddFiles([FromForm] UploadFile fileData)
        {            
            var res = new UploadHandler().UploadFiles(fileData);

            // Read response from helper to determine type of response
            switch (res.Status)
            {
                case 200:
                    return Ok(new { message = res.Message });
                case 400: 
                    return BadRequest(new { message = res.Message, successfulFiles = res.SuccessfulFiles });
                default:
                    return StatusCode(res.Status, new { message = res.Message });
            }
        }
    }
}