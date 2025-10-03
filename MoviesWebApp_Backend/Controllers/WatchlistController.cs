
using dbms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static dbms.DTO.MovieDTOs;

namespace dbms.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WatchlistController : ControllerBase
    {
        private readonly postgresContext _context;

        public WatchlistController(postgresContext context)
        {
            _context = context;
        }

        [HttpPost("/add-to-watchlist/{movieId}")]
        public async Task<IActionResult> AddToWatchlist(int movieId, [FromBody] UserMovieDto userMovieDto)
        {
            if (userMovieDto == null || userMovieDto.UserId <= 0 || movieId <= 0)
            {
                return BadRequest(new { message = "Invalid data provided" });
            }

            var existingWatchlist = await _context.Watchlists
                                                 .FirstOrDefaultAsync(f => f.UserId == userMovieDto.UserId && f.MovieId == movieId);
            if (existingWatchlist != null)
            {
                return BadRequest(new { message = "Movie is already in the user's watchlist" });
            }


            var watchlist = new Watchlist
            {
                UserId = userMovieDto.UserId,
                MovieId = movieId,
                Adddate = DateOnly.MaxValue,
            };

            _context.Watchlists.Add(watchlist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Movie added to Watchlist successfully" });
        }

        [HttpGet("/user-watchlist/{userId}")]
        public async Task<IActionResult> GetUserWatchlist(int userId)
        {
            if (userId <= 0)
            {
                return BadRequest(new { message = "Invalid user ID" });
            }

            var watchlist = await _context.Watchlists
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

            if (watchlist == null || !watchlist.Any())
            {
                return NotFound(new { message = "No favorite movies found for the user" });
            }

            return Ok(watchlist);
        }


    }
}
