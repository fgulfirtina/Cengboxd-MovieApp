import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import movieService from './movieService';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Added state for search term
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        console.log('Fetching movies...');
        const data = await movieService.getAllMovies();
        console.log('Fetched movies:', data); 
        setMovies(data); 
      } catch (error) {
        console.error(error); 
        setError('Error fetching movies'); 
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`); 
  };

  // Filter movies based on the search term
  const filteredMovies = movies.filter((movie) =>
    movie.movieName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToMoviesSection = () => {
    const targetSection = document.querySelector(".search-bar-container");
    targetSection.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    document.title = "Cengboxd";
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">WELCOME TO CENGBOXD</h1>
          <p className="hero-description">Discover and explore your favorite movies.</p>
          <button className="hero-button" onClick={scrollToMoviesSection}>Browse Movies</button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>
  
      {/* Movies Grid Section */}
      <div className="homeContainer">
        <div className="movies-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
              <div className="movie-card" key={movie.movieId} onClick={() => handleMovieClick(movie.movieId)}>
                <div className="movie-poster-container">
                  {movie.imageurl ? (
                    <img src={movie.imageurl} alt={movie.movieName} className="movie-poster" />
                  ) : (
                    <div className="placeholder">No Image Available</div>
                  )}
                </div>
                <div className="movie-info">
                  <h2 className="movie-name">{movie.movieName}</h2>
                  <p className="movie-description">{movie.description}</p>
                  <p className="movie-attribute">Release Date: {movie.releaseDate}</p>
                  <p className="movie-attribute">Genre(s): {movie.genres.join(", ")}</p>
                  <p className="movie-attribute">Score: {movie.movieScore + ' / 5'}</p>
                </div>
              </div>
            ))
          ) : (
            <div>No movies available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
