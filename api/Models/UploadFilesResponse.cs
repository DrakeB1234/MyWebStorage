namespace api.Models
{
    public class UploadFilesResponse
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public List<string>? SuccessfulFiles { get; set; }
        public string? Token { get; set; }
    }
}