using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class FolderModel
    {
        public required string FolderName { get; set; }
        public required string FolderPath { get; set; }
    }
}