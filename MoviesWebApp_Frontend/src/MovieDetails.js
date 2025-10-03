import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import movieService from './movieService';
import './MovieDetails.css';
import ReviewForm from './ReviewForm';
import { AuthContext } from './AuthProvider';
import { Link } from 'react-router-dom';

const MovieDetails = () => {
  const { movieId } = useParams();
  const { user, isLoggedIn } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(1);
  const [trailer, setTrailer] = useState(null);  // Changed to store the trailer
  const [hoveredRating, setHoveredRating] = useState(null); // For hover effect
  const [isHovered, setIsHovered] = useState(false); // For hover state
  const [genres, setGenres] = useState([]);
  const [director, setDirector] = useState([]);  // Set to empty array by default
  const [actors, setActors] = useState([]);      // Set to empty array by default


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

  const fetchGenres = async (movieId) => {
    try {
      const movieGenres = await movieService.getGenres(movieId);
      setGenres(movieGenres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchDirector = async (movieId) => {
    try {
      const movieDirector = await movieService.getDirector(movieId);
      setDirector(movieDirector);
    } catch (error) {
      console.error('Error fetching director:', error);
    }
  };

  const fetchActors = async (movieId) => {
    try {
      const movieActors = await movieService.getActors(movieId);
      setActors(movieActors);
    } catch (error) {
      console.error('Error fetching actors:', error);
    }
  };

  const displayTrailer = async () => {
    try {
      const trailer = await movieService.getTrailer(movieId);
      if (trailer && trailer.trailerurl) {
        const videoId = trailer.trailerurl.split('v=')[1]; // Extract video ID from URL
        setTrailer(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
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
    fetchGenres(movieId);
    fetchDirector(movieId);
    fetchActors(movieId);
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
          <div className="poster-container">
            {!trailer && (
              <img
                src={movie.imageurl}
                alt={movie.movieName}
                className="movie-poster"
              />
            )}

            {/* Watch Trailer Button */}
            {!trailer && (
            <div
              className="play-button"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={displayTrailer}
            ></div>
          )}
          </div>

          {/* Trailer Display */}
          {trailer && (
            <div className="trailer-container">
              <iframe
                width="100%"
                height="500"
                src={trailer}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <p>{movie.description}</p>
          <p>Release Date: {movie.releaseDate}</p>

          {/* Genres, Director, and Actors */}
          <p>Genre: {genres.join(', ')}</p>
          <p>
  Director: 
  {director.length > 0 ? (
    director.map((director, index) => (
      <Link key={index} to={`/director/${director}`} className="director-link">
        {director}
      </Link>
    ))
  ) : (
    'No director available'
  )}
</p>

          <p>
  Actors: 
  {actors.length > 0 ? (
    actors.map((actor, index) => (
      <Link key={index} to={`/actor/${actor}`} className="actor-link">
        {actor}
      </Link>
    ))
  ) : (
    'No actors available'
  )}
</p>

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
