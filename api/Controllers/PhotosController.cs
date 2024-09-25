using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Data;
using api.Models;
using api.Models.Domain;
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
            var fileNames = from filePath in Directory.GetFiles(strPath, "*", SearchOption.AllDirectories)
            let filename = Path.GetFileName(filePath)
            orderby filename
            select filename;

            return Ok(fileNames);
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