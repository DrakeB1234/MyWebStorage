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
        
        private readonly string strPath;
        
        public FilesController()
        {
            // Get Config
            this.config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            this.strPath = config.GetValue<string>("FileUploadPath");
        }
        
        [HttpGet("GetAllFilePaths")]
        public IActionResult GetAllFilePaths()
        {
            List<FileModel> fileList = new List<FileModel>();
            
            // LINQ
            var fileNames = from filePath in Directory.GetFiles(strPath, "*", SearchOption.TopDirectoryOnly)
                let filename = Path.GetFileName(filePath)
                select filename;

            foreach (var item in fileNames)
            {
                var fileInfo = new FileInfo(strPath + "/" + item);
                fileList.Add(new FileModel { FileName = item, FileLength = fileInfo.Length });
            }

            // Prevent errors on Angular HttpClient by ensuring response is in JSON
            return Ok(fileList);
        }

        [HttpGet("GetImage/{path}")]
        public IActionResult GetImage(string path)
        {
            var image = System.IO.File.OpenRead(strPath + "/" + path);

            return File(image, "image/jpeg");
        }

        [HttpPost("AddFiles")]
        public IActionResult AddFiles([FromForm] UploadFile files)
        {            
            var res = new UploadHandler().Upload(files.files);

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
    }
}