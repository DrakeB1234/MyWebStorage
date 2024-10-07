using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using api.Models;

namespace api.Helpers
{
    public class UploadHandler
    {
        // Get config from appsettings
        IConfiguration config;

        private readonly List<string>? validExtensions;
        private readonly string? rootPath;
        private readonly long? MaxFileUploadSize;

        public UploadHandler() 
        {
            // Gets all config files for uploading files
            config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            validExtensions = config.GetSection("AllowedExtensions").Get<List<string>>();
            rootPath = config.GetValue<string>("FileUploadPath");
            MaxFileUploadSize = config.GetValue<long>("MaxFileUploadSize");
        }
        
        public UploadFilesResponse UploadFile([FromForm] UploadFile fileData)
        {
            // Check for null config (sastifies complier ig)
            if (validExtensions == null || rootPath == null || MaxFileUploadSize == null) {
                return new UploadFilesResponse { Status = 500, Message = "Internal Server Error: App config is not properly set up" };
            }

            IFormFile file = fileData.file;
            var uploadPath = rootPath + "/" + fileData.UploadPath + "/";

            // Get file names from dir, to later check uploaded files for duplicate names
            var fileNames = from filePath in Directory.GetFiles(uploadPath, "*", SearchOption.TopDirectoryOnly)
                let filename = Path.GetFileName(filePath)
                orderby filename
                select filename;

            try
            {
                // Check if path in form req exists in directory
                if (!Directory.Exists(uploadPath))
                {
                    return new UploadFilesResponse { Status = 400, Message = $"Bad Request: Provided folder path does not exist." };
                }

                // Check for Valid Extension
                string extension = Path.GetExtension(file.FileName).ToLower();
                if (!validExtensions.Contains(extension))
                {
                    return new UploadFilesResponse { Status = 400, Message = $"File '{file.FileName}' doesn't have valid extension."};
                }

                // Check if file doesn't exceed size limit (30 mb)
                if (file.Length > MaxFileUploadSize) {
                    var byteConversion = (MaxFileUploadSize /  1024) / 1024; 

                    // Divide upload limit to match mb size
                    return new UploadFilesResponse { Status = 400, Message = $"File '{file.FileName}' exceeds upload limit of {byteConversion} mb."};
                }

                // Add upload path from form req, then add file name
                // Check uploaded file for duplicate name
                var uploadPathFile = uploadPath + file.FileName;

                foreach (var item in fileNames)
                {
                    // If name matches what is in directory, then create a random GUID to put in filename
                    // To avoid rewriting existing files
                    if (item == file.FileName)
                    {
                        uploadPathFile = uploadPath + Path.GetFileNameWithoutExtension(file.FileName) + "-" + Guid.NewGuid() + extension;
                    }
                }

                using FileStream stream = new FileStream(uploadPathFile, FileMode.Create);
                file.CopyTo(stream);

                return new UploadFilesResponse { Status = 200, Message = $"File successfully uploaded to {uploadPath}" };
            }
            catch (Exception)
            {
                return new UploadFilesResponse { Status = 500, Message = $"Internal server error: File failed to upload" };
            }
        }

        public UploadFilesResponse UploadFolder([FromForm] UploadFolder folderData)
        {
            // Check for null config (sastifies complier ig)
            if (rootPath == null) {
                return new UploadFilesResponse { Status = 500, Message = "Internal Server Error: App config is not properly set up" };
            }

            string uploadPath = "";

            // Check if upload path is in req, then add path to upload path, else use root
            if (folderData.FolderPath != null)
            {
                uploadPath = Path.Combine(rootPath, folderData.FolderPath);

                // Check if provided folder path already exists to prevent creating sub dirs
                if (!Directory.Exists(uploadPath))
                {
                    return new UploadFilesResponse { Status = 400, Message = $"Bad Request: Provided folder path does not exist." };
                }
            }
            else 
            {
                uploadPath = rootPath;
            }

            try
            {
                // Combine upload path with the new folder name from req
                if (!Directory.Exists(Path.Combine(uploadPath, folderData.FolderName)))
                {
                    Directory.CreateDirectory(Path.Combine(uploadPath, folderData.FolderName));
                }
                else
                {
                    return new UploadFilesResponse { Status = 400, Message = $"Bad Request: Duplicate folder name." };
                }

                return new UploadFilesResponse { Status = 200, Message = $"Folder successfully added to {uploadPath}" };
            }
            catch (Exception ex)
            {
                return new UploadFilesResponse { Status = 500, Message = $"Internal server error: Failed to add folder. Error: {ex.Message}." };
            }
        }
    }   
}