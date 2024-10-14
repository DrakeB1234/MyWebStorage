using System.Net;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.StaticFiles;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using LibreHardwareMonitor.Hardware;
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
        
        private readonly string? rootPath;
        private readonly TimeSpan ImageCacheTimeDays;
        private readonly double ImageCacheTimeSeconds;
        private readonly List<string> imageExtensions;
        private readonly List<string> videoExtensions;
        private readonly List<string> documentExtensions;

        
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

            this.imageExtensions = config.GetSection("ImageExtensions").Get<List<string>>();
            this.videoExtensions = config.GetSection("VideoExtensions").Get<List<string>>();
            this.documentExtensions = config.GetSection("DocumentExtensions").Get<List<string>>();
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

            // Check for null extensions (sastifies complier ig)
            if (imageExtensions == null || videoExtensions == null || documentExtensions == null) {
                return StatusCode(500, new { Files = fileList, Message = "Internal Server Error: App config is not properly set up" });
            }

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
                else if (documentExtensions.Contains(fileExtension))
                {
                    fileExtension = "document";
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
                            Response.Headers["Cache-Control"] = $"public,max-age={ImageCacheTimeSeconds}";
                            Response.Headers["Expires"] = DateTime.UtcNow.Add(ImageCacheTimeDays).ToString("R");
                            Response.Headers["Pragma"] = "cache";

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

        [AllowAnonymous]
        [HttpGet("GetFile/{_paramspath}")]
        public async Task<IActionResult> GetFile(string _paramspath)
        {
            // Decode url encoding from _parampath to make readable by code
            _paramspath = WebUtility.UrlDecode(_paramspath);
            var loadFilePath = rootPath + "/" + _paramspath;

            try
            {
                // Check if the file exists
                if (!System.IO.File.Exists(loadFilePath))
                {
                    return NotFound(new { message = "File not found" });
                }

                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(loadFilePath);

                return File(fileBytes, "application/octet-stream", _paramspath);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error processing file: {ex.Message}" });
            }
        }

        [AllowAnonymous]
        [HttpGet("GetVideo/{_paramspath}")]
        public async Task<IActionResult> GetVideo(string _paramspath)
        {
            // Decode url encoding from _parampath to make readable by code
            _paramspath = WebUtility.UrlDecode(_paramspath);
            var loadFilePath = rootPath + "/" + _paramspath;

            try
            {
                // Check if the file exists
                if (!System.IO.File.Exists(loadFilePath))
                {
                    return NotFound(new { message = "Video not found" });
                }

                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(loadFilePath);

                return File(fileBytes, "video/mp4", _paramspath);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error processing video: {ex.Message}" });
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

        [HttpPost("MoveFile")]
        public IActionResult MoveFile([FromBody] MoveFile fileData)
        {            

            var orgFilePath = fileData.FilePath + "/" + fileData.FileName;
            var newFilePath = rootPath + "/" + fileData.FileDestination;
            
            if (!System.IO.File.Exists(orgFilePath))
            {
                return NotFound(new { Message = $"file not found: {fileData.FileName} at {orgFilePath}" });
            }

            // Ensure destination directory exists
            if (!Directory.Exists(newFilePath))
            {
                return NotFound(new { Message = $"Folder not found: {newFilePath}" });
            }

            try
            {
                System.IO.File.Move(orgFilePath, newFilePath + "/" + fileData.FileName);

                return Ok(new { Message = $"File moved to: {newFilePath}" });
            }
            catch (Exception ex)
            {
                    return StatusCode(500, new { Message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("DownloadFile/{downloadPath}")]
        public IActionResult DownloadFile(string downloadPath)
        {            
            // Decode url encoding from _parampath to make readable by code
            downloadPath = WebUtility.UrlDecode(downloadPath);
            var checkPath = rootPath + $"/{downloadPath}";
            string fileExtension = Path.GetExtension(downloadPath);

            // Check if file exists
            if (System.IO.File.Exists(checkPath))
            {
                var image = System.IO.File.OpenRead(rootPath + $"/{downloadPath}");

                // Uses this MIME type to allow different file types to be downloaded and not forced to one type
                return File(image, "application/octet-stream", downloadPath);
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

        [HttpGet("ServerInfo")]
        public IActionResult ServerInfo()
        {       
            // Try to get server current storage data
            var currentServerInfo = new ServerInfoModel();     
            try
            {
                string driveLetter = Regex.Match(rootPath, @"^[a-zA-Z]:").Value;

                // Check if drive letter is valid
                if (!driveLetter.EndsWith(":")) 
                {
                    driveLetter += ":";
                }

                // Create a DriveInfo object for the specified drive
                DriveInfo drive = new DriveInfo(driveLetter);

                if (!drive.IsReady)
                {
                    return BadRequest("Drive is not ready.");
                }

                // Assign Values
                long totalSpace = drive.TotalSize;
                long freeSpace = drive.TotalFreeSpace;
                long usedSpace = totalSpace - freeSpace;

                currentServerInfo.ServerCurrentStorage = usedSpace;
                currentServerInfo.ServerMaxStorage = totalSpace;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error getting storage data: {ex.Message}" });
            }

            // Get total amount of files from root 
            try
            {
                // Check if the directory exists
                if (!Directory.Exists(rootPath))
                {
                    return NotFound($"Directory '{rootPath}' not found.");
                }

                var files = Directory.GetFiles(rootPath, "*", SearchOption.AllDirectories);

                currentServerInfo.StoredFiles = files.Length;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error getting amount of files from root: {ex.Message}" });
            }

            // Get server cpu temp 
            try
            {
                var computer = new Computer
                {
                    IsCpuEnabled = true // Enable CPU sensors
                };
                computer.Open();

                foreach (var hardware in computer.Hardware)
                {
                    if (hardware.HardwareType == HardwareType.Cpu)
                    {
                        hardware.Update(); // Update sensor data

                        foreach (var sensor in hardware.Sensors)
                        {
                            if (sensor.SensorType == SensorType.Temperature)
                            {
                                currentServerInfo.ServerTemperture = sensor.Value;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error getting amount of cpu temp from server: {ex.Message}" });
            }

            return Ok(new { data = currentServerInfo });
        }
    }
}