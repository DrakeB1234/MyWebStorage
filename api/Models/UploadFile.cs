namespace api.Models
{
    public class UploadFile
    {
        public string uploadPath { get; set; }
        public IList<IFormFile> files { get; set; }
    }
}