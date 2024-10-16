using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using System.Text.RegularExpressions;
using api.Models;
using api.Helpers;

namespace api.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FolderController: ControllerBase
    {

        // Get config from appsettings
        private readonly IConfiguration config;
        
        private readonly string? rootPath;
        
        public FolderController()
        {
            // Get Config
            this.config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            this.rootPath = config.GetValue<string>("FileUploadPath");
        }
        
        // Gets all dirs in current dir
        [HttpGet("GetAllDirectories/{_paramspath?}")]
        public IActionResult GetAllDirectories(string? _paramspath)
        {
            // Check for null config (sastifies complier ig)
            if (rootPath == null) {
                return StatusCode(500, new { Message = "Internal Server Error: App config is not properly set up" });
            }

            // Remove drive path from root path to compare parameter
            string parsedRootPath = rootPath.Substring(Path.GetPathRoot(rootPath).Length);

            // Decode url encoding from _parampath to make readable by code
            _paramspath = WebUtility.UrlDecode(_paramspath);
            
            List<FolderModel> FolderList = new List<FolderModel>();
            string[] tempFolderList = [];

            try
            {

                // Check if passed path is null, then return root dirs
                if (_paramspath == null) 
                {
                    tempFolderList = Directory.GetDirectories(rootPath);
                }
                else 
                {
                    // For whatever reason path.combine not working, so for now explicity combine paths
                    tempFolderList = Directory.GetDirectories(rootPath + _paramspath);
                }

                foreach (var item in tempFolderList)
                {
                    // Parse folder path with /
                    var parsedFolderPath = item.Replace('\\', '/');
                    
                    // Remove root path from directory name
                    FolderList.Add(new FolderModel { FolderName = Regex.Match(item, @"[^\/\\]+(?=[\/\\]?$)").Value, FolderPath = parsedFolderPath.Replace(rootPath, "") });
                }
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Could not find a part of the path"))
                {
                    return StatusCode(404, $"Could not find any directories under the path {rootPath + _paramspath}");
                }
                return StatusCode(500, ex.Message);
            }

            // Prevent errors on Angular HttpClient by ensuring response is in JSON
            return Ok(FolderList);
        }

        // Gets all dirs from root
        [HttpGet("GetAllRootDirectories")]
        public IActionResult GetAllRootDirectories()
        {
            // Check for null config (sastifies complier ig)
            if (rootPath == null) {
                return StatusCode(500, new { Message = "Internal Server Error: App config is not properly set up" });
            }

            // Remove drive path from root path to compare parameter
            string parsedRootPath = rootPath.Substring(Path.GetPathRoot(rootPath).Length);
            
            List<FolderModel> FolderList = new List<FolderModel>();
            List<string> tempFolderList = GetDirectoriesRecursive(rootPath);

            try
            {
                foreach (var item in tempFolderList)
                {
                    // Parse folder path with /
                    var parsedFolderPath = item.Replace('\\', '/');
                    
                    // Remove root path from directory name
                    FolderList.Add(new FolderModel { FolderName = Regex.Match(item, @"[^\/\\]+(?=[\/\\]?$)").Value, FolderPath = parsedFolderPath.Replace(rootPath, "") });
                }
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Could not find a part of the path"))
                {
                    return StatusCode(404, $"Could not find any directories under the path {Path.Combine(rootPath)}");
                }
                return StatusCode(500, ex.Message);
            }

            // Prevent errors on Angular HttpClient by ensuring response is in JSON
            return Ok(FolderList);
        }

        [HttpPost("AddDirectory")]
        public IActionResult AddDirectory([FromForm] UploadFolder folderData)
        {                        
            var res = new UploadHandler().UploadFolder(folderData);

            // Read response from helper to determine type of response
            switch (res.Status)
            {
                case 200:
                    return Ok(new { message = res.Message });
                case 400:
                    return BadRequest(new { message = res.Message });
                default:
                    return StatusCode(res.Status, new { message = res.Message });
            }
        }

        [HttpPatch("RenameDirectory")]
        public IActionResult RenameDirectory([FromBody] RenameFolderModel folderData)
        {
            // Ensure values passed are not empty
            if (string.IsNullOrWhiteSpace(folderData.NewFolderName) || string.IsNullOrWhiteSpace(folderData.FolderPath)) {
                return BadRequest(new { Message = "Fields can not be empty"});
            }

            var oldPath = rootPath + folderData.FolderPath;
            // Remove last folder name from path with regex, then add new folder name
            var newPath = Regex.Replace(oldPath, @"[^\/\\]+(?=[\/\\]?$)", string.Empty);
            newPath += folderData.NewFolderName;
            
            try
            {
                if (Directory.Exists(oldPath))
                {
                    if (!Directory.Exists(newPath))
                    {
                        // Rename (move) the directory
                        Directory.Move(oldPath, newPath);

                        return Ok(new { message = "Directory renamed successfully", newPath = Regex.Replace(folderData.FolderPath, @"[^\/\\]+(?=[\/\\]?$)", folderData.NewFolderName) });
                    }
                    else
                    {
                        // The new path already exists
                        return Conflict(new { message = "A directory with the new name already exists" });
                    }
                }
                else
                {
                    // Old directory doesn't exist
                    return NotFound(new { message = "Directory not found" });
                }
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return StatusCode(500, new { message = $"Internal Server Error: Error {ex.Message}" });
            }        
        }

        [HttpDelete("DeleteDirectory")]
        public IActionResult DeleteDirectory([FromBody] FolderModel folderData)
        {                
            var path = rootPath + folderData.FolderPath;  
            try
            {
                // Check if directory is not root
                if (path == this.rootPath) {
                    return BadRequest(new { message = "Cannot delete root directory" });
                }

                // Check if directory exists
                if (Directory.Exists(path))
                {
                    // Delete directory, only allowed if directory is empty
                    Directory.Delete(path, false);

                    // Return success message
                    return Ok(new { message = "Directory deleted successfully" });
                }
                else
                {
                    // Directory doesn't exist
                    return NotFound(new { message = "Directory not found" });
                }
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return StatusCode(500, new { message = $"Internal Server error: Error: {ex}" });
            }
        }

        // Helper method to recursively get directories
        private List<string> GetDirectoriesRecursive(string rootPath)
        {
            List<string> directories = new List<string>();

            // Get all directories in the current path
            foreach (var dir in Directory.GetDirectories(rootPath))
            {
                directories.Add(dir);
                // Recursively get directories in the current subdirectory
                directories.AddRange(GetDirectoriesRecursive(dir));
            }

            return directories;
        }
    }
}