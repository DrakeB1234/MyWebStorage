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
            
            string[] directoryList = [];

            try
            {

                // Check if passed path is null, then return root dirs
                if (_paramspath == null) 
                {
                    directoryList = Directory.GetDirectories(rootPath);
                }
                else 
                {
                    directoryList = Directory.GetDirectories(Path.Combine(rootPath, _paramspath));
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
            return Ok(directoryList);
        }
    }
}