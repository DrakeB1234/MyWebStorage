namespace api.Models
{
    public class UploadFolder
    {
        public required string FolderName { get; set; }
        
        public string? FolderPath { get; set; }
    }
}