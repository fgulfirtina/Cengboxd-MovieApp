
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static dbms.DTO.UserDTOs;
using static dbms.DTO.MovieDTOs;
using dbms.Models;
using Microsoft.Extensions.Caching.Distributed;

namespace dbms.Controllers
{
    [Route("api/[controller]")]
    [ApiController] 
    public class UserController : ControllerBase
    {
        private readonly postgresContext _context;

        public UserController(postgresContext context)
        {
            _context = context;
        }

        [HttpPost("/user-profile")]
        public async Task<IActionResult> GetUser([FromBody] UserProfileDto userProfileDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userProfileDto.Email);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }
            return Ok(user);
        }

        [HttpPut("edit-profile")]
        public async Task<IActionResult> EditProfile([FromForm] EditProfileDto editProfileDto)
        {
            if (editProfileDto == null)
            {
                return BadRequest(new { message = "Invalid profile data" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == editProfileDto.Email);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            user.Name = editProfileDto.Name ?? user.Name;
            user.Age = editProfileDto.Age ?? user.Age;
            user.Gender = editProfileDto.Gender ?? user.Gender;

            if (editProfileDto.ProfilePicture != null)
            {
                // Generate unique file name
                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(editProfileDto.ProfilePicture.FileName)}";

                // Define uploads folder path
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

                // Ensure the folder exists
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Full path for saving the file
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Save the file to the uploads folder
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await editProfileDto.ProfilePicture.CopyToAsync(stream);
                }

                // Set the profile picture URL (relative path)
                user.Profilepic = $"/uploads/{uniqueFileName}";
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Profile updated successfully",
                profilePictureUrl = user.Profilepic // Return the new profile picture URL if updated
            });
        }


        [HttpDelete("/delete-account/{userId}")]
        public async Task<IActionResult> DeleteAccount(int userId)
        {
            if (userId <= 0)
            {
                return BadRequest(new { message = "Invalid user ID" });
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "CALL delete_user_and_associated_data({0})", userId);

                return Ok(new { message = "Account and associated data deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while deleting the account",
                    error = ex.Message
                });
            }
        }

        [HttpGet("/get-users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _context.Users.ToListAsync(); 

                if (users == null || users.Count == 0)
                {
                    return NotFound(new { message = "No users found" });
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching the users",
                    error = ex.Message
                });
            }
        }
    }
}
