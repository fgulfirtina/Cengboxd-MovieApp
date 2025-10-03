
using dbms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static dbms.DTO.MovieDTOs;

namespace dbms.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly postgresContext _context;

        public FavoritesController(postgresContext context)
        {
            _context = context;
        }

        [HttpPost("/add-to-favorites/{movieId}")]
        public async Task<IActionResult> AddToFavorites(int movieId, [FromBody] UserMovieDto userMovieDto)
        {
            if (userMovieDto == null || userMovieDto.UserId <= 0 || movieId <= 0)
            {
                return BadRequest(new { message = "Invalid data provided" });
            }

            var existingFavorite = await _context.Favorites
                                                 .FirstOrDefaultAsync(f => f.UserId == userMovieDto.UserId && f.MovieId == movieId);
            if (existingFavorite != null)
            {
                return BadRequest(new { message = "Movie is already in the user's favorites" });
            }


            var favorite = new Favorite
            {
                UserId = userMovieDto.UserId,
                MovieId = movieId,
                Adddate = DateOnly.MaxValue,
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Movie added to favorites successfully" });
        }

        [HttpGet("/user-favorites/{userId}")]
        public async Task<IActionResult> GetUserFavorites(int userId)
        {
            if (userId <= 0)
            {
                return BadRequest(new { message = "Invalid user ID" });
            }

            var favorites = await _context.Favorites
                                          .Where(f => f.UserId == userId)
                                          .Include(f => f.Movie)
                                          .Select(f => new
                                          {
                                              f.Movie.MovieId,
                                              f.Movie.MovieName,
                                              f.Movie.Description,
                                              f.Movie.Imageurl,
                                              f.Movie.MovieScore
                                          })
                                          .ToListAsync();

            if (favorites == null || !favorites.Any())
            {
                return NotFound(new { message = "No favorite movies found for the user" });
            }

            return Ok(favorites);
        }
    }
}
