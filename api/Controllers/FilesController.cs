using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.StaticFiles;
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

                fileList.Add(new FileModel { FileName = item, FileLength = fileInfo.Length, FileType = fileExtension });
            }

            // Prevent errors on Angular HttpClient by ensuring response is in JSON
            return Ok(new { Files = fileList });
        }

        [AllowAnonymous]
        [HttpGet("GetImage/{_paramspath}")]
        public IActionResult GetImage(string _paramspath)
        {
            // Decode url encoding from _parampath to make readable by code
            _paramspath = WebUtility.UrlDecode(_paramspath);

            var image = System.IO.File.OpenRead(rootPath + "/" + _paramspath);

            return File(image, "image/jpeg");
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