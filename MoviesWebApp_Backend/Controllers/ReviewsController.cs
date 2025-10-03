
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dbms.Models;
using dbms.DTO;
using static dbms.DTO.MovieDTOs;

namespace dbms.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly postgresContext _context;

        public ReviewsController(postgresContext context)
        {
            _context = context;
        }

        [HttpPost("/add-review")]
        public async Task<IActionResult> AddReview([FromBody] MovieDTOs.MoviePropDto moviePropDto)
        {
            if (moviePropDto == null || string.IsNullOrEmpty(moviePropDto.ReviewText))
            {
                return BadRequest(new { message = "Invalid review data" });
            }

            
            int rating = moviePropDto.Rating ?? -1;
            DateOnly reviewDate = moviePropDto.ReviewDate ?? DateOnly.FromDateTime(DateTime.Now);

            
            var existingReview = await _context.Reviews
                .Where(r => r.UserId == moviePropDto.UserId && r.MovieId == moviePropDto.MovieId)
                .FirstOrDefaultAsync();

            if (existingReview != null)
            {
                
                if (rating == -1)
                {
                    rating = (int)existingReview.Rating;
                }

                
                existingReview.Reviewtext = moviePropDto.ReviewText;
                existingReview.ReviewDate = reviewDate;

                
                existingReview.Rating = rating;
                _context.Reviews.Update(existingReview);
            }
            else
            {
               
                var review = new Review
                {
                    UserId = moviePropDto.UserId,
                    MovieId = moviePropDto.MovieId,
                    Reviewtext = moviePropDto.ReviewText,
                    Rating = rating,
                    ReviewDate = reviewDate
                };

                _context.Reviews.Add(review);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Review added successfully" });
        }
        [HttpGet("/user-reviews/{userId}")]
        public async Task<IActionResult> GetUserReviews(int userId)
        {
            if (userId <= 0)
            {
                return BadRequest(new { message = "Invalid user ID" });
            }

            var reviews = await _context.Reviews
                                        .Where(r => r.UserId == userId)
                                        .Include(r => r.Movie)
                                        .Select(r => new
                                        {
                                            r.Movie.MovieId,
                                            r.Movie.MovieName,
                                            r.Movie.Description,
                                            r.Movie.Imageurl,
                                            r.Rating,
                                            r.Reviewtext,
                                            r.ReviewDate
                                        })
                                        .ToListAsync();

            if (reviews == null || !reviews.Any())
            {
                return NotFound(new { message = "No reviews found for the user" });
            }

            return Ok(reviews);
        }

        [HttpGet("/get-reviews/{movieId}")]
        public async Task<IActionResult> GetReview(int movieId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Where(r => r.MovieId == movieId)
                    .Join(_context.Users,
                          review => review.UserId,
                          user => user.UserId,
                          (review, user) => new
                          {
                              review.ReviewId,
                              review.UserId,
                              review.MovieId,
                              review.Reviewtext,
                              review.Rating,
                              review.ReviewDate,
                              User = new
                              {
                                  user.Username
                              }
                          })
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching reviews", error = ex.Message });
            }
        }

        [HttpDelete("/control-reviews/{reviewId}")]
        public async Task<IActionResult> ControlReviews(int reviewId)
        {
            if (reviewId <= 0)
            {
                return BadRequest(new { message = "Invalid review ID" });
            }

            var review = await _context.Reviews
                                        .FirstOrDefaultAsync(r => r.ReviewId == reviewId);

            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review deleted successfully" });
        }


        [HttpPost("/update-rating")]
        public async Task<IActionResult> UpdateRating([FromBody] MoviePropDto moviePropDto)
        {


            DateOnly reviewDate = moviePropDto.ReviewDate ?? DateOnly.FromDateTime(DateTime.Now);
            if (moviePropDto == null || moviePropDto.MovieId <= 0 || moviePropDto.UserId <= 0 || moviePropDto.Rating == null)
            {
                return BadRequest(new { message = "Invalid data provided" });
            }

            int rating = moviePropDto.Rating.Value;
            if (rating < 1 || rating > 5)
            {
                return BadRequest(new { message = "Rating must be between 1 and 5" });
            }


            var existingReview = await _context.Reviews
                                                .FirstOrDefaultAsync(r => r.MovieId == moviePropDto.MovieId && r.UserId == moviePropDto.UserId);


            if (existingReview == null)
            {
                var review = new Review
                {
                    UserId = moviePropDto.UserId,
                    MovieId = moviePropDto.MovieId,
                    Reviewtext = moviePropDto.ReviewText,
                    Rating = rating,
                    ReviewDate = reviewDate
                };

                _context.Reviews.Add(review);

            }
            else 
            { 
                existingReview.Rating= rating;
                _context.Reviews.Update(existingReview);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Rating updated successfully" });
        }

        [HttpPut("/update-average-rating/{movieId}")]
        public async Task<IActionResult> UpdateAverageRating(int movieId)
        {
            if (movieId <= 0)
            {
                return BadRequest(new { message = "Invalid movie ID" });
            }
            var reviews = await _context.Reviews
                                        .Where(r => r.MovieId == movieId && r.Rating != -1)
                                        .ToListAsync();
            double averageRating = 0;
            if (reviews != null && reviews.Any())
            {
                int totalRating = (int)reviews.Sum(r => r.Rating);
                int numberOfRatings = reviews.Count;
                averageRating = (double)totalRating / numberOfRatings;
            }
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieId == movieId);
            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }
            movie.MovieScore = (decimal?)Math.Round(averageRating, 2);
            _context.Movies.Update(movie);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                movieId = movie.MovieId,
                averageRating = movie.MovieScore,
                message = "Average rating updated successfully"
            });
        }
    }
}
