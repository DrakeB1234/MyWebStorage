using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DotNetEnv;
using api.Models;

namespace api.Helpers
{
    public class AuthHandler
    {
        // Get config from appsettings
        private readonly IConfiguration config;
                
        public AuthHandler()
        {
            // Get Config
            this.config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();
        }

        public UploadFilesResponse Signin([FromForm] LoginModel formData)
        {
            var appUser = Environment.GetEnvironmentVariable("MWS_USER");
            var appPass = Environment.GetEnvironmentVariable("MWS_PASS");
            
            if (formData.Username == appUser && formData.Password == appPass)
            {
                // Generate JWT Token
                var token = GenerateJwtToken(formData.Username);
                return new UploadFilesResponse { Status = 200, Message = "Successfully logged in", Token = token };
            }
            else 
            {
                return new UploadFilesResponse { Status = 401, Message = "Invalid Credentials" };
            }
        }

        public string GenerateJwtToken(string Username)
        {
            var jwtSettings = config.GetSection("JwtSettings");
            var apiKey = Environment.GetEnvironmentVariable("API_KEY");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, Username)
                }),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpirationInMinutes"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(apiKey)), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);        }
    }
}