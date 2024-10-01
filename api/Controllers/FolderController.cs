using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using api.Models;
using api.Helpers;

namespace api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class FolderController: ControllerBase
    {

        // Get config from appsettings
        private readonly IConfiguration config;
        
        private readonly string rootPath;
        
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
            // Remove drive path from root path to compare parameter
            string parsedRootPath = rootPath.Substring(Path.GetPathRoot(rootPath).Length);
            
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
                    tempFolderList = Directory.GetDirectories(Path.Combine(rootPath, _paramspath));
                }

                foreach (var item in tempFolderList)
                {
                    // Remove root path from directory name
                    FolderList.Add(new FolderModel {FolderName = item.Replace(rootPath + "\\", "")});
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

        [HttpPost("PostDirectory")]
        public IActionResult PostDirectory([FromForm] UploadFolder folderData)
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