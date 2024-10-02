using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Helpers;

namespace api.Controllers
{

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
                        
            // LINQ
            var fileNames = from filePath in Directory.GetFiles(getPath, "*", SearchOption.TopDirectoryOnly)
                let filename = Path.GetFileName(filePath)
                select filename;

            foreach (var item in fileNames)
            {
                var fileInfo = new FileInfo(getPath + "/" + item);
                fileList.Add(new FileModel { FileName = item, FileLength = fileInfo.Length });
            }

            // Prevent errors on Angular HttpClient by ensuring response is in JSON
            return Ok(fileList);
        }

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