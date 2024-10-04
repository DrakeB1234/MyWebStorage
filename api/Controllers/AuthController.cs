using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using api.Models;
using api.Helpers;

namespace api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController: ControllerBase
    { 
        [AllowAnonymous]
        [HttpPost("Signin")]
        public IActionResult Signin([FromForm] LoginModel formData)
        {
            var res = new AuthHandler().Signin(formData);

            // Read response from helper to determine type of response
            switch (res.Status)
            {
                case 200:
                    return Ok(new { message = res.Message, Token = res.Token });
                case 400: 
                    return BadRequest(new { message = res.Message });
                case 401: 
                    return Unauthorized(new { message = res.Message });
                default:
                    return StatusCode(res.Status, new { message = res.Message });
            }
        }

        [Authorize]
        [HttpGet("Authenticate")]
        public IActionResult Authenticate()
        {
            // This works due to built in handler in net that will protect this route, if
            // Someone tries to authenticate without proper token, will return 401
            return Ok(new { Message = "Token valid"});
        }
    }
}