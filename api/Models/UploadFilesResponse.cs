namespace api.Models
{
    public class UploadFilesResponse
    {
        public required int Status { get; set; }
        public required string Message { get; set; }
        public string? Token { get; set; }
    }
}