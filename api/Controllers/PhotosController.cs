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
        // Get Config
        IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables()
            .Build();

        private readonly StorageDbContext dbContext;
        
        public PhotosController(StorageDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        
        [HttpGet]
        public IActionResult GetAllPhotos()
        {
            string strPath = config.GetValue<string>("PhotoUploadPath");

            // Get file names from dir, then check if duplicate name
            var fileNames = Directory.GetFiles(strPath, "*", SearchOption.AllDirectories)
                .ToList();

            return Ok(fileNames);
        }

        [HttpPost]
        public IActionResult UploadPhoto(IFormFile file)
        {
            return Ok(new UploadHandler().Upload(file));
        }
    }
}