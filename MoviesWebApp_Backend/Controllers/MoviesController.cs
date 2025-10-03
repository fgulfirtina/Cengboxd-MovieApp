using Microsoft.AspNetCore.Mvc;
using dbms.Services;
using Microsoft.EntityFrameworkCore;
using dbms.Models;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace dbms.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly postgresContext _context;

        public MoviesController(postgresContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetMovies()
        {
            var movies = await _context.Movies
                .Select(movie => new
                {
                    movie.MovieId,
                    movie.MovieName,
                    movie.MovieScore,
                    movie.ReleaseDate,
                    movie.Duration,
                    movie.Description,
                    movie.Imageurl,
                    
                })
                .ToListAsync();

            return Ok(movies);
        }

        [HttpGet("/api/Movies/{movieId}")]
        public async Task<IActionResult> GetMovieById(int movieId)
        {
            try
            {
                var movie = await _context.Movies
                   
                    .Where(m => m.MovieId == movieId)
                    .Select(m => new
                    {
                        m.MovieId,
                        m.MovieName,
                        m.MovieScore,
                        m.ReleaseDate,
                        m.Duration,
                        m.Description,
                        m.Imageurl,
                    
                    })
                    .FirstOrDefaultAsync();

                if (movie == null)
                {
                    return NotFound(new { message = "Movie not found" });
                }

                return Ok(movie);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching movie", error = ex.Message });
            }
        }

        [HttpGet("/Trailers/{movieId}")]
        public async Task<ActionResult<object>> GetMovieTrailerById(int movieId)
        {
            try
            {
                var movieTrailer = await _context.Set<Movietrailer>()
                    .FromSqlRaw("SELECT movie_id, trailerurl FROM MovieTrailers WHERE movie_id = {0}", movieId)
                    .FirstOrDefaultAsync();

                if (movieTrailer == null)
                {
                    return NotFound(new { message = "Movie trailer not found" });
                }

                return Ok(movieTrailer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching movie trailer", error = ex.Message });
            }
        }

        [HttpPut("/edit-movie/{movieId}")]
        public async Task<IActionResult> EditMovie(int movieId, [FromBody] Movie updatedMovie)
        {
            try
            {
                var movie = await _context.Movies
                    .FirstOrDefaultAsync(m => m.MovieId == movieId);

                if (movie == null)
                {
                    return NotFound(new { message = "Movie not found" });
                }

                movie.MovieName = updatedMovie.MovieName;
                movie.ReleaseDate = updatedMovie.ReleaseDate;
                movie.Description = updatedMovie.Description;
                movie.Imageurl = updatedMovie.Imageurl;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Movie updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating movie", error = ex.Message });
            }
        }


        [HttpDelete("/delete-movie/{movieId}")]
        public async Task<IActionResult> DeleteMovie(int movieId)
        {
            try
            {
                var result = await _context.Database.ExecuteSqlRawAsync("SELECT delete_movie({0})", movieId);

                if (result == 0)
                {
                    return NotFound(new { message = "Movie not found or already deleted" });
                }

                return Ok(new { message = "Movie deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting movie", error = ex.Message });
            }
        }
    }
}
