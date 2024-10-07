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
                    return StatusCode(404, $"Could not find any directories under the path {Path.Combine(rootPath, _paramspath)}");
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
    }
}