using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Data;
using api.Models;
using api.Models.Domain;

namespace api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController: ControllerBase
    {
        private readonly StorageDbContext dbContext;
        
        public PhotosController(StorageDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        
        [HttpGet]
        public IActionResult GetAllPhotos()
        {
            var photos = dbContext.Photos.ToList();
            return Ok(photos);
        }

        [HttpPost]
        public IActionResult AddPhoto(AddPhotoRequestDTO req)
        {
            var domainModelContact = new Photo
            {
                Id = Guid.NewGuid(),
                ImagePath = req.ImagePath,
                Name = req.Name,
                DateAdded = req.DateAdded,
                Folder = req.Folder,
                Favorite = req.Favorite
            };

            dbContext.Photos.Add(domainModelContact);
            dbContext.SaveChanges();

            return Ok(domainModelContact);
        }
    }
}