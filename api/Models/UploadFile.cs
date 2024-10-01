namespace api.Models
{
    public class UploadFile
    {
        public string? UploadPath { get; set; }
        public IList<IFormFile> files { get; set; }
    }
}