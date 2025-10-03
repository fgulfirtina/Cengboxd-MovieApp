using dbms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dbms.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorController : ControllerBase
    {
        private readonly postgresContext _context;

        public DirectorController(postgresContext context)
        {
            _context = context;
        }

        [HttpGet("/get-director/{movieId}")]
        public async Task<IActionResult> GetDirector(int movieId)
        {
            try
            {
                var director = await _context
                    .Set<Director>()
                    .FromSqlRaw("SELECT director_name FROM get_movie_directors({0})", movieId)
                    .Select(x => x.DirectorName)
                    .ToListAsync();

                return Ok(director);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching director", error = ex.Message });
            }
        }

        [HttpGet("/get-all-directors")]

        public async Task<IActionResult> GetAllDirectors()
        {
            var directors = await _context.Directors
            .Select(director => new
            {
               director.DirectorId,
               director.DirectorName,
               director.Biography,
               director.Nationality,
               director.Birtdate,
               director.Awards

            }).ToListAsync();

            return Ok(directors);
        }

        [HttpPost("/add-director")]
        public async Task<IActionResult> AddDirector([FromBody] string newDirectorName)
        {
            if (string.IsNullOrEmpty(newDirectorName))
            {
                return BadRequest(new { message = "Director name is required" });
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync("SELECT add_director({0})", newDirectorName);

                return Ok(new { message = "Director added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding director", error = ex.Message });
            }
        }

        [HttpDelete("/delete-director/{directorId}")]
        public async Task<IActionResult> DeleteDirector(int directorId)
        {
            if (directorId <= 0)
            {
                return BadRequest(new { message = "Invalid director ID." });
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync("SELECT delete_director({0})", directorId);

                return Ok(new { message = "director deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting director", error = ex.Message });
            }
        }

        [HttpPut("/edit-director/{directorId}")]
        public async Task<IActionResult> EditDirector(int directorId, [FromBody] Director updatedDirector)
        {
            if (directorId <= 0 || updatedDirector == null)
            {
                return BadRequest(new { message = "Invalid director ID or data." });
            }

            try
            {
                var existingDirector = await _context.Directors.FindAsync(directorId);
                if (existingDirector == null)
                {
                    return NotFound(new { message = "Director not found." });
                }

                // Update fields
                existingDirector.DirectorName = updatedDirector.DirectorName ?? existingDirector.DirectorName;
                existingDirector.Biography = updatedDirector.Biography ?? existingDirector.Biography;
                existingDirector.Birtdate = updatedDirector.Birtdate ?? existingDirector.Birtdate;
                existingDirector.Nationality = updatedDirector.Nationality ?? existingDirector.Nationality;
                existingDirector.Awards = updatedDirector.Awards ?? existingDirector.Awards;

                // Save changes
                await _context.SaveChangesAsync();

                return Ok(new { message = "Director updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating director", error = ex.Message });
            }
        }

        [HttpGet("/get-director-withId/{directorId}")]
        public async Task<IActionResult> GetDirectorById(int directorId)
        {
            if (directorId <= 0)
            {
                return BadRequest(new { message = "Invalid director ID." });
            }

            try
            {
                var director = await _context.Directors
                    .Where(a => a.DirectorId == directorId)
                    .Select(a => new
                    {
                        a.DirectorId,
                        a.DirectorName,
                        a.Biography,
                        a.Birtdate,
                        a.Nationality,
                        a.Awards
                    })
                    .FirstOrDefaultAsync();

                if (director == null)
                {
                    return NotFound(new { message = "Director not found." });
                }

                return Ok(director);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching director details", error = ex.Message });
            }
        }

        [HttpGet("/director-details/{directorName}")]
        public async Task<IActionResult> GetDirectorDetails(string directorName)
        {
            try
            {
                var director = await _context.Directors
                    .Where(a => a.DirectorName == directorName)
                    .FirstOrDefaultAsync();

                if (director == null)
                {
                    return NotFound(new { message = "Director not found" });
                }

                return Ok(director); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching director details", error = ex.Message });
            }
        }
    }
}
