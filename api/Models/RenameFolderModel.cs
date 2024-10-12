namespace api.Models
{
    public class RenameFolderModel
    {
        public required string NewFolderName { get; set; }
        public required string FolderPath { get; set; }
    }
}