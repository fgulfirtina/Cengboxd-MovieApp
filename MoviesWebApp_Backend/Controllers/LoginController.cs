
using dbms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static dbms.DTO.LoginDTOs;

namespace dbms.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly postgresContext _context;

        public LoginController(postgresContext context)
        {
            _context = context;
        }

        [HttpPost("/register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            // Check if the email is already registered
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email is already registered" });
            }

            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                Username = registerDto.Username,
                Password = registerDto.Password // Store password as plain text (not recommended for production)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("/login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            // Retrieve the user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Compare the password correctly
            if (user.Password != loginDto.Password)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

           

            return Ok(new { message = "Login successful" });
        }
    }
}
