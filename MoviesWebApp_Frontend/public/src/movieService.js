import axios from 'axios';

const MOVIE_URL = 'https://localhost:44398/api/Movies'; 
const USER_URL = 'https://localhost:44398/user-profile';
const REVIEW_URL = 'https://localhost:44398/api/Reviews';
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
  }
  
};

export default movieService;
