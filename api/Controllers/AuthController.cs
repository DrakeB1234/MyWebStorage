using Microsoft.AspNetCore.Mvc;
using api.Models;

namespace api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController: ControllerBase
    { 
        [HttpPost("Authenticate")]
        public IActionResult Authenticate([FromForm] LoginModel formData)
        {
            var appUser = Environment.GetEnvironmentVariable("MWS_USER");
            var appPass = Environment.GetEnvironmentVariable("MWS_PASS");
            
            if (formData.Username == appUser && formData.Password == appPass)
            {
                return Ok(new { Message = "Ok", User = appUser });
            }
            else 
            {
                return Unauthorized(new { Message = "Invalid login" });
            }

        }
    }
}