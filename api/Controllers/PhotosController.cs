using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Data;
using api.Models;
using api.Helpers;

namespace api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController: ControllerBase
    {

        private readonly IConfiguration config;
        private readonly string strPath;
        
        public PhotosController()
        {
            // Get Config
            this.config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            this.strPath = config.GetValue<string>("PhotoUploadPath");
        }
        
        [HttpGet("GetAllPhotos")]
        public IActionResult GetAllPhotos()
        {
            List<PhotoFile> fileList = new List<PhotoFile>();
            
            // LINQ
            var fileNames = from filePath in Directory.GetFiles(strPath, "*", SearchOption.AllDirectories)
                let filename = Path.GetFileName(filePath)
                select filename;

            foreach (var item in fileNames)
            {
                var fileInfo = new FileInfo(strPath + "/" + item);
                fileList.Add(new PhotoFile(item, fileInfo.Length));
            }

            return Ok(fileList);
        }

        [HttpGet("GetPhotoFile/{path}")]
        public IActionResult GetPhotoFile(string path)
        {
            var image = System.IO.File.OpenRead(strPath + "/" + path);

            return File(image, "image/jpeg");
        }

        [HttpPost("AddPhoto")]
        public IActionResult UploadPhoto(IFormFile file)
        {
            return Ok(new UploadHandler().Upload(file));
        }
    }
}