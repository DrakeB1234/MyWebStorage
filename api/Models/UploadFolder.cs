using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class UploadFolder
    {
        [Required]
        public string FolderName { get; set; }
        
        public string? FolderPath { get; set; }
    }
}