import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import movieService from './movieService';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [movieGenres, setMovieGenres] = useState({}); 
  const [movieActors, setMovieActors] = useState({});
  const [movieDirector, setMovieDirectors] = useState({});
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [directorFilter, setDirectorFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');


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

  const fetchGenres = async (movieId) => {
    try {
      const movieGenres = await movieService.getGenres(movieId);
      setMovieGenres((prevState) => ({
        ...prevState,
        [movieId]: movieGenres || [], 
      }));
    } catch (error) {
      console.error('Error fetching genres:', error);
      setMovieGenres((prevState) => ({
        ...prevState,
        [movieId]: [], 
      }));
    }
  };

  const fetchActors = async (movieId) => {
    try {
      const movieActors = await movieService.getActors(movieId);
      setMovieActors((prevState) => ({
        ...prevState,
        [movieId]: movieActors || [], 
      }));
    } catch (error) {
      console.error('Error fetching actors:', error);
      setMovieActors((prevState) => ({
        ...prevState,
        [movieId]: [], 
      }));
    }
  };

  const fetchDirector = async (movieId) => {
    try {
      const movieDirector = await movieService.getDirector(movieId);
      setMovieDirectors((prevState) => ({
        ...prevState,
        [movieId]: movieDirector || [], 
      }));
    } catch (error) {
      console.error('Error fetching director:', error);
      setMovieDirectors((prevState) => ({
        ...prevState,
        [movieId]: [], 
      }));
    }
  };

  useEffect(() => {
    movies.forEach((movie) => {
      if (movie.movieId && !movieGenres[movie.movieId]) {
        fetchGenres(movie.movieId);
      }
    });
  }, [movies, movieGenres]); 

  useEffect(() => {
    movies.forEach((movie) => {
      if (movie.movieId && !movieActors[movie.movieId]) {
        fetchActors(movie.movieId);
      }
    });
  }, [movies, movieActors]); 

  useEffect(() => {
    movies.forEach((movie) => {
      if (movie.movieId && !movieDirector[movie.movieId]) {
        fetchDirector(movie.movieId);
      }
    });
  }, [movies, movieDirector]); 

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // Filter movies based on the search term
  const filteredMovies = movies.filter((movie) => {
    const genres = movieGenres[movie.movieId] || [];
    const actors = movieActors[movie.movieId] || [];
    const director = movieDirector[movie.movieId] || '';
  
    // Ensure 'director' is a string by joining if it's an array
    const directorString = Array.isArray(director) ? director.join(', ') : director;
  
    const matchesSearchTerm = movie.movieName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre ? genres.includes(selectedGenre) : true;
    const matchesScore = movie.movieScore >= minScore;
    const matchesDirector = directorFilter
      ? directorString.toLowerCase().includes(directorFilter.toLowerCase())
      : true;
    const matchesActor = actorFilter
      ? actors.some((actor) => actor.toLowerCase().includes(actorFilter.toLowerCase()))
      : true;
  
    return matchesSearchTerm && matchesGenre && matchesScore && matchesDirector && matchesActor;
  });
  
  

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
  
      {/* Filtering UI */}
      <div className="filter-container">
        <div className="filter-item">
          <label htmlFor="genre-filter">Genre:</label>
          <select
            id="genre-filter"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All</option>
            {Array.from(new Set(Object.values(movieGenres).flat())).map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="score-filter">Minimum Score:</label>
          <input
            type="number"
            id="score-filter"
            value={minScore}
            min="0"
            max="5"
            step="0.1"
            onChange={(e) => setMinScore(Number(e.target.value))}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="director-filter">Director:</label>
          <input
            type="text"
            id="director-filter"
            value={directorFilter}
            placeholder="Director name"
            onChange={(e) => setDirectorFilter(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="actor-filter">Actor:</label>
          <input
            type="text"
            id="actor-filter"
            value={actorFilter}
            placeholder="Actor name"
            onChange={(e) => setActorFilter(e.target.value)}
          />
        </div>
      </div>
  
      {/* Movies Grid Section */}
      <div className="homeContainer">
        <div className="movies-grid">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => {
              const genres = movieGenres[movie.movieId] || [];
              return (
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
                    <p className="movie-attribute">Release Date: {movie.releaseDate}</p>
                    <p className="movie-attribute">
                      Genre(s): {genres.length > 0 ? genres.join(', ') : 'N/A'}
                    </p>
                    <p className="movie-attribute">Score: {movie.movieScore + ' / 5'}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No movies available.</div>
          )}
        </div>
      </div>
    </div>
  );  
};

export default Home;
