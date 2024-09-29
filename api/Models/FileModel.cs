namespace api.Models
{
    public class FileModel
    {
        public string FileName { get; set; }
        public long FileLength { get; set; }

        public FileModel (string FileName, long FileLength)
        {
            this.FileName = FileName;
            this.FileLength = FileLength;   
        }
    }
}