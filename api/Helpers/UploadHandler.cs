using Microsoft.Extensions.Configuration;

namespace api.Helpers
{
    public class UploadHandler
    {
        List<string> validExtensions = new List<string>()
        {
            ".jpg", ".png", ".jpeg", ".gif", ".mp4", ".avi", ".mov", ".jfif",
            ".JPG", ".PNG", ".JPEG", ".GIF", ".MP4", ".AVI", ".MOV", ".JFIF"
        };
        
        public string Upload(IFormFile file)
        {
            // Extension
            string extension = Path.GetExtension(file.FileName);
            if (!validExtensions.Contains(extension))
            {
                return $"Extension is not valid ({string.Join(',', validExtensions)})";
            }
            
            // File Size
            long size = file.Length;
            if (size > (100 * 1024 * 1024))
            {
                return "Max size for file upload is 100mb";
            }

            // Get Config
            IConfiguration config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();
                        
            string strPath = config.GetValue<string>("PhotoUploadPath");

            // Get file names from dir, then check if duplicate name
            var fileNames = from filePath in Directory.GetFiles(strPath, "*", SearchOption.AllDirectories)
                let filename = Path.GetFileName(filePath)
                orderby filename
                select filename;

            bool duplicate = false;
            foreach (var item in fileNames)
            {
                if (item == file.FileName)
                {
                    duplicate = true;
                    break;
                }
            }

            var uploadPath = strPath + "/" + file.FileName;
            if (duplicate)
            {
                uploadPath = strPath + "/" + Path.GetFileNameWithoutExtension(file.FileName) + "-" + Guid.NewGuid() + extension;
            }

            using FileStream stream = new FileStream(uploadPath, FileMode.Create);
            file.CopyTo(stream);
            return $"File Uploaded to ({uploadPath})";
        }
    }
}