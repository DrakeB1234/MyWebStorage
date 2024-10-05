namespace api.Models
{
    public class FileModel
    {
        public string FileType { get; set; }
        public string FileName { get; set; }
        public long FileLength { get; set; }
        public DateTime? FileCreationDate { get; set; }
        public string? FileDirectoryName { get; set; }
        public string? FileCameraMake { get; set; }
        public string? FileCameraModel { get; set; }
    }
}