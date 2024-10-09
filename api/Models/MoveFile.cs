namespace api.Models
{
    public class MoveFile
    {
        public required string FileName { get; set; }
        public required string FilePath { get; set; }
        public string? FileDestination { get; set; }
    }
}