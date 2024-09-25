namespace api.Models
{
    public class PhotoFile
    {
        public string FileName { get; set; }
        public long FileLength { get; set; }

        public PhotoFile(string FileName, long FileLength)
        {
            this.FileName = FileName;
            this.FileLength = FileLength;   
        }
    }
}