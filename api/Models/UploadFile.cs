namespace api.Models
{
    public class UploadFile
    {
        public string? UploadPath { get; set; }
        public IFormFile file { get; set; }
    }
}