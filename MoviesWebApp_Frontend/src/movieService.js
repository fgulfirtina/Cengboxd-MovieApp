import axios from 'axios';

const MOVIE_URL = 'https://localhost:44398/api/Movies'; 
const USER_URL = 'https://localhost:44398/user-profile';
const RATING_URL = 'https://localhost:44398'; 

const movieService = {
  getAllMovies: async () => {
    try {
      const response = await axios.get(MOVIE_URL);
      return response.data; 
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error; 
    }
  },

  getMovieById: async (movieId) => {
    try {
      const response = await axios.get(`${MOVIE_URL}/${movieId}`); 
      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  },

  getActorById: async (actorId) => {
    try {
      const response = await axios.get(`https://localhost:44398/get-actor-withId/${actorId}`); 
      return response.data;
    } catch (error) {
      console.error("Error fetching actor details:", error);
      throw error;
    }
  },

  getDirectorById: async (directorId) => {
    try {
      const response = await axios.get(`https://localhost:44398/get-director-withId/${directorId}`); 
      return response.data;
    } catch (error) {
      console.error("Error fetching director details:", error);
      throw error;
    }
  },

  getUserInfo: async (userId) => {
    try {
      const response = await axios.post(USER_URL, { userId });  
      return response.data.email;  
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error; 
    }
  },

  getReviews: async (movieId) => {
    try {
      const response = await axios.get(`https://localhost:44398/get-reviews/${movieId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  getTrailer: async(movieId) => {
    try {
      const response = await axios.get(`https://localhost:44398/trailers/${movieId}`);
      return response.data;
    } catch (error) {
      console.error("Trailer not found:", error);
      throw error;
    }
  },

  updateRating: async (movieId, userId, rating) => {
    try {
      const response = await axios.post(`${RATING_URL}/update-rating`, {
        MovieId: movieId,
        UserId: userId,
        Rating: rating
      });
      return response.data.message; 
    } catch (error) {
      console.error("Error updating rating:", error);
      throw error;
    }
  },

  updateAverageRating: async (movieId) => {
    try {
      const response = await axios.put(`${RATING_URL}/update-average-rating/${movieId}`);
      return response.data.averageRating; 
    } catch (error) {
      console.error("Error updating average rating:", error);
      throw error;
    }
  },

  addToFavorites: async (movieId, userId) => {
    try {
      const response = await axios.post(`${RATING_URL}/add-to-favorites/${movieId}`, {
        UserId: userId
      });
      return response.data.message;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  },

  addToWatchlist: async (movieId, userId) => {
    try {
      const response = await axios.post(`${RATING_URL}/add-to-watchlist/${movieId}`,{
        UserId: userId
      });
      return response.data.message;
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      throw error;
    }
  },

  controlReview: async (reviewId) => {
    try {
      const response = await axios.delete(`https://localhost:44398/control-reviews/${reviewId}`);
      return response.data.message || 'Review controlled successfully';
    } catch (error) {
      console.error("Error controlling review:", error);
      throw new Error('Failed to control review');
    }
  },

  getAllUsers: async () => {
    try {
      const response = await axios.get(`https://localhost:44398/get-users`);
      return response.data; 
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  editMovie: async (movieId, updatedMovieData) => {
    try {
      const response = await axios.put(`https://localhost:44398/edit-movie/${movieId}`, updatedMovieData);
      return response.data.message || "Movie updated successfully"; 
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;  
    }
  },

  editActor: async (actorId, updatedActorData) => {
    try {
      const response = await axios.put(`https://localhost:44398/edit-actor/${actorId}`, updatedActorData);
      return response.data.message || "Actor updated successfully"; 
    } catch (error) {
      console.error("Error updating actor:", error);
      throw error;  
    }
  },

  editDirector: async (directorId, updatedDirectorData) => {
    try {
      const response = await axios.put(`https://localhost:44398/edit-director/${directorId}`, updatedDirectorData);
      return response.data.message || "Director updated successfully"; 
    } catch (error) {
      console.error("Error updating director:", error);
      throw error;  
    }
  },

  deleteMovie: async (movieId) => {
    try {
      const response = await axios.delete(`https://localhost:44398/delete-movie/${movieId}`);
      return response.data; 
    } catch (error) {
      console.error("Error deleting movie:", error.response ? error.response.data : error.message);
      throw error; 
    }
  },

  getActors: async (movieId) => {
    try {
      const response = await axios.get(`https://localhost:44398/get-actors/${movieId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching actors:", error);
      throw error; 
    }
  },

  getDirector: async(movieId) => {
    try {
      const response = await axios.get(`https://localhost:44398/get-director/${movieId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching director:", error);
      throw error; 
    }
  },

  getGenres: async(movieId) => {
    try {
      const response = await axios.get(`https://localhost:44398/get-genres/${movieId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error; 
    }
  },

  getAllActors: async() => {
    try {
      const response = await axios.get(`https://localhost:44398/get-all-actors`);
      return response.data;
    } catch (error) {
      console.error("Error getting Actors:", error);
    }
  },

  getAllDirectors: async() =>
  {
    try {
      const response = await axios.get(`https://localhost:44398/get-all-directors`);
      return response.data;
    } catch (error) {
      console.error("Error getting directors:", error);
    }
  },

  getAllGenres: async() =>
  {
    try {
      const response = await axios.get(`https://localhost:44398/get-all-genres`);
      return response.data;
    } catch (error) {
      console.error("Error getting genres:", error);
    }
  },

  getActorDetails: async(actorName) => 
  {
    try {
      const response = await axios.get(`https://localhost:44398/actor-details/${actorName}`);
      return response.data;
    } catch (error) {
      console.error("Error getting actor details:", error);
    }
  },

  getDirectorDetails : async(directorName) =>
  {
    try {
      const response = await axios.get(`https://localhost:44398/director-details/${directorName}`);
      return response.data;
    } catch (error) {
      console.error("Error getting director details:", error);
    }
  }
};

export default movieService;
