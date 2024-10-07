namespace api.Models
{
    public class UploadFile
    {
        public string? UploadPath { get; set; }
        public required IFormFile file { get; set; }
    }
}