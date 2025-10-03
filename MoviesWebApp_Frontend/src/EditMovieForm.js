import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import movieService from './movieService'; 
import './Form.css';

const EditMovieForm = () => {
  const { movieId } = useParams(); 
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await movieService.getMovieById(movieId);
        setMovie(movieData);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedMovie = {
      ...movie,
      releaseDate: new Date(movie.releaseDate).toISOString(),  // Ensure it's a valid date format
    };

    try {
      console.log('Submitting movie data:', updatedMovie); // Log movie data before submitting

      await movieService.editMovie(movieId, updatedMovie);  // Send the PUT request
      alert('Movie updated successfully!');
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Failed to update the movie. Please try again.');
    }
  };

  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  return (
    <div>
      <div className="form-container">
        <h2 className="form-title">Edit Movie</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Movie Name:
            <input
              type="text"
              value={movie.movieName}
              className="form-input"
              onChange={(e) => setMovie({ ...movie, movieName: e.target.value })}
            />
          </label>
          
          <label>
            Description:
            <textarea
              value={movie.description}
              className="form-textarea"
              onChange={(e) => setMovie({ ...movie, description: e.target.value })}
            />
          </label>
          
          <label>
            Release Date:
            <input
              type="date"
              value={movie.releaseDate || ''}
              className="form-input"
              onChange={(e) => setMovie({ ...movie, releaseDate: e.target.value })}
            />
          </label>
          <br></br>
          <br></br>
          <label>
            Poster URL:
            <input
              type="text"
              value={movie.imageurl || ''}
              className="form-input"
              onChange={(e) => setMovie({ ...movie, imageurl: e.target.value })}
            />
          </label>
          <div className="button-group">
                        <button type="submit" className="submit-button">
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className="form-button cancel-button"
                            onClick={() => navigate('/admin')}
                        >
                            Cancel
                        </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovieForm;
