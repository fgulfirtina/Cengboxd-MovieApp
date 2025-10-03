
using dbms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dbms.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly postgresContext _context;

        public GenreController(postgresContext context)
        {
            _context = context;
        }

        [HttpGet("/get-genres/{movieId}")]
        public async Task<IActionResult> GetGenres(int movieId)
        {
            try
            {
                var genres = await _context
                    .Set<Genre>()
                    .FromSqlRaw("SELECT genre_name FROM get_movie_genres({0})", movieId)
                    .Select(x => x.GenreName)
                    .ToListAsync();

                return Ok(genres);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching genres", error = ex.Message });
            }
        }

        [HttpGet("/get-all-genres")]
        public async Task<IActionResult> GetAllGenres()
        {
            var genres = await _context.Genres
            .Select(genre => new
            {
                genre.GenreId,
                genre.GenreName
            }).ToListAsync();

            return Ok(genres);
        }


        [HttpPost("/add-genre")]
        public async Task<IActionResult> AddGenre([FromBody] string newGenreName)
        {
            if (string.IsNullOrEmpty(newGenreName))
            {
                return BadRequest(new { message = "Genre name is required" });
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync("SELECT add_genre({0})", newGenreName);

                return Ok(new { message = "Genre added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding genre", error = ex.Message });
            }
        }

        [HttpDelete("/delete-genre/{genreId}")]
        public async Task<IActionResult> DeleteGenre(int genreId)
        {
            if (genreId <= 0)
            {
                return BadRequest(new { message = "Invalid genre ID." });
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync("SELECT delete_genre({0})", genreId);

                return Ok(new { message = "Genre deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting genre", error = ex.Message });
            }
        }
    }
}
