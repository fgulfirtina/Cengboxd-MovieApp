import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import movieService from './movieService';
import './MovieDetails.css';
import ReviewForm from './ReviewForm';
import { AuthContext } from './AuthProvider';

const MovieDetails = () => {
  const { movieId } = useParams();
  const { user, isLoggedIn } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(1);
  const [hoveredRating, setHoveredRating] = useState(null); // For hover effect

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieService.getMovieById(movieId);
      setMovie({
        ...data,
        score: data.movieScore,
      });
    } catch (error) {
      setError('Error fetching movie details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const reviewsData = await movieService.getReviews(movieId);
      if (reviewsData && Array.isArray(reviewsData)) {
        setReviews(
          reviewsData.map((review) => ({
            ...review,
            user: review.user ? review.user.username : 'Unknown',
          }))
        );
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [movieId]);

  const handleAddToFavorites = async () => {
    if (!isLoggedIn || !user) {
      setError('You must be logged in to add a movie to favorites.');
      return;
    }
    try {
      const message = await movieService.addToFavorites(movieId, user.userId);
      setError(message);
    } catch (error) {
      setError('Failed to add movie to favorites.');
    }
  };

  const handleAddToWatchlist = async () => {
    if (!isLoggedIn || !user) {
      setError('You must be logged in to add a movie to the watchlist.');
      return;
    }
    try {
      const message = await movieService.addToWatchlist(movieId, user.userId);
      setError(message);
    } catch (error) {
      setError('Failed to add movie to watchlist.');
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (isLoggedIn && user) {
      try {
        await movieService.updateRating(movieId, user.userId, rating);
        const updatedAverageRating = await movieService.updateAverageRating(movieId);
        setMovie((prevMovie) => ({
          ...prevMovie,
          score: updatedAverageRating,
        }));

        setRating(0); // Reset rating UI
        await fetchReviews();
      } catch (error) {
        setError('Error submitting your rating. Please try again.');
      }
    }
  };

  const handleReviewSubmit = async (newReviewText) => {
    if (isLoggedIn && user) {
      try {
        await movieService.updateReview(movieId, user.userId, newReviewText);
        await fetchReviews();
      } catch (error) {
        setError('Error submitting your review. Please try again.');
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= (hoveredRating || rating) ? 'filled' : ''}`}
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(null)}
        >
          &#9733; {/* Unicode star symbol */}
        </span>
      );
    }
    return stars;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="movie-details">
      {movie && (
        <>
          <h1>{movie.movieName}</h1>
          <img src={movie.imageurl} alt={movie.movieName} />
          <p>{movie.description}</p>
          <p>Release Date: {movie.releaseDate}</p>
          <p>Genre: {movie.genres.join(', ') || 'N/A'}</p>
          <p>Score: {(movie.score + ' / 5') || 'No score available'}</p>

          {isLoggedIn && (
            <div className="action-buttons">
              <button className="favorite-btn" onClick={handleAddToFavorites}>
                ❤️ Add to Favorites
              </button>
              <button className="watchlist-btn" onClick={handleAddToWatchlist}>
                📺 Add to Watchlist
              </button>
              {error && <div className="error-message">{error}</div>}
            </div>
          )}

          <ReviewForm movieId={movieId} onReviewSubmit={handleReviewSubmit} />

          {isLoggedIn && (
            <div className="rating-section">
              <h3>Rate This Movie:</h3>
              <form onSubmit={handleRatingSubmit}>
                <div>
                  <div className="stars-container">
                    {renderStars()}
                  </div>
                </div>
                <button type="submit-button">Submit Rating</button>
              </form>
            </div>
          )}

          <div className="reviews-section">
            <h2>Reviews:</h2>
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.reviewId} className="review">
                  <p><strong>{review.user}</strong>: {review.reviewtext}</p>
                  <p>Rating: {review.rating === -1 ? 'N/A' : review.rating}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
