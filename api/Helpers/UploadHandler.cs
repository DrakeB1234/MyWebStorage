using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using api.Models;

namespace api.Helpers
{
    public class UploadHandler
    {
        // Get config from appsettings
        IConfiguration config;

        private readonly List<string> validExtensions;
        private readonly string rootPath;
        private readonly long MaxFileUploadSize;
        private readonly int MaxFileRequestSize;

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
            MaxFileRequestSize = config.GetValue<int>("MaxFileRequestSize");
        }
        
        public UploadFilesResponse UploadFiles([FromForm] UploadFile fileData)
        {
            IList<IFormFile> files = fileData.files;
            var uploadPath = rootPath + "/" + fileData.UploadPath + "/";

            // Check if path in form req exists in directory
            if (!Directory.Exists(uploadPath))
            {
                return new UploadFilesResponse { Status = 400, Message = $"Bad Request: Provided folder path does not exist." };
            }
            
            // If no files are uploaded, then return
            if (files == null || files.Count == 0)
            {
                return new UploadFilesResponse { Status = 400, Message = "No files uploaded." };
            }

            // Limit uploads to amount set in appsettings.json per request
            if (files.Count > MaxFileRequestSize)
            {
                return new UploadFilesResponse { Status = 400, Message = $"Too many files uploaded at once. Limit per request is {MaxFileRequestSize} files." };
            }

            // Get file names from dir, to later check uploaded files for duplicate names
            var fileNames = from filePath in Directory.GetFiles(uploadPath, "*", SearchOption.TopDirectoryOnly)
                let filename = Path.GetFileName(filePath)
                orderby filename
                select filename;

            // Keep track of successful file uploads in case file in request throws error
            List<String> successfulFileUploads = new List<String>();

            try
            {
                foreach (var file in files)
                {
                    // Check for Valid Extension
                    string extension = Path.GetExtension(file.FileName);
                    if (!validExtensions.Contains(extension))
                    {
                        // Continue to next itx of loop for failed files
                        continue;
                    }

                    // Check if file doesn't exceed size limit (30 mb)
                    if (file.Length > MaxFileUploadSize) {
                        // Continue to next itx of loop for failed files
                        continue;
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

                    // If above code is ran successfully, add to list to keep track of sucessful file uploads
                    successfulFileUploads.Add(file.FileName);
                }

                // If loop runs above, then return success message
                return new UploadFilesResponse { Status = 200, Message = $"All files successfully uploaded to {uploadPath}" };
            }
            catch (Exception ex)
            {
                // If any files were successfully uploaded, include them in error message
                if (successfulFileUploads.Count > 0) {
                    return new UploadFilesResponse { Status = 500, Message = $"Internal server error: Failed uploads - {files.Count - successfulFileUploads.Count}. Files that uploaded successfully {successfulFileUploads}." };
                }
                return new UploadFilesResponse { Status = 500, Message = $"Internal server error: No Files in request were uploaded. Error: {ex.Message}." };
            }
        }

        public UploadFilesResponse UploadFolder([FromForm] UploadFolder folderData)
        {
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