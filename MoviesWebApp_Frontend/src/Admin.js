import React, { useContext, useState, useEffect } from "react";
import movieService from "./movieService"; // Assuming movieService is correctly imported
import { AuthContext } from "./AuthProvider";
import axios from "axios";
import "./Admin.css";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const { user, logout } = useContext(AuthContext);
    const [isManagingReviews, setIsManagingReviews] = useState(false);
    const [isManagingUsers, setIsManagingUsers] = useState(false);
    const [isManagingMovies, setIsManagingMovies] = useState(false);
    const [isManagingGenres, setIsManagingGenres] = useState(false);
    const [isManagingDirectors, setIsManagingDirectors] = useState(false);
    const [isManagingActors, setIsManagingActors] = useState(false);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [genres, setGenres] = useState([]);
    const [director, setDirector] = useState(null);
    const [actors, setActors] = useState([]);
    const [allActors, setAllActors] = useState([]);
    const [allDirectors, setAllDirectors] = useState([]);
    const [allGenres, setAllGenres] = useState([]);
    const [isAddingGenre, setIsAddingGenre] = useState(false);
    const [isAddingActor, setIsAddingActor] = useState(false);
    const [isAddingDirector, setIsAddingDirector] = useState(false);
    const [newGenreName, setNewGenre] = useState(null);
    const [newActorName, setNewActor] = useState(null);
    const [newDirectorName, setNewDirector] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieData = await movieService.getAllMovies();
                setMovies(movieData);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        fetchMovies();
    }, []);

    const fetchReviews = async (movieId) => {
        if (!movieId) {
            console.error("Invalid movie ID");
            return;
        }

        try {
            const reviewsData = await movieService.getReviews(movieId);
            setReviews(reviewsData);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const usersData = await movieService.getAllUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchGenres = async (movieId) => {
        try {
            const movieGenres = await movieService.getGenres(movieId);
            setGenres(movieGenres);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const fetchDirector = async (movieId) => {
        try {
            const movieDirector = await movieService.getDirector(movieId);
            setDirector(movieDirector);
        } catch (error) {
            console.error("Error fetching director:", error);
        }
    };

    const fetchActors = async (movieId) => {
        try {
            const movieActors = await movieService.getActors(movieId);
            setActors(movieActors);
        } catch (error) {
            console.error("Error fetching actors:", error);
        }
    };

    const fetchAllActors = async () => {
        try {
            const actors = await movieService.getAllActors();
            setAllActors(actors);
        } catch (error) {
            console.error("Error fetching actors:", error);
        }
    };

    const fetchAllDirectors = async () => {
        try {
            const directors = await movieService.getAllDirectors();
            setAllDirectors(directors);
        } catch (error) {
            console.error("Error fetching directors:", error);
        }
    };

    const fetchAllGenres = async () => {
        try {
            const genres = await movieService.getAllGenres();
            setAllGenres(genres);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const addGenre = async () => {
        try {
            if (!newGenreName || newGenreName.trim() === "") {
                throw new Error(
                    "The newGenreName is required and cannot be empty."
                );
            }
            const response = await axios.post(
                `https://localhost:44398/add-genre`,
                newGenreName,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                alert("Genre added successfully.");
                setNewGenre("");
                setIsAddingGenre(false);
                fetchAllGenres();
            } else {
                alert("Failed to add genre.");
            }
        } catch (error) {
            console.error("Error adding genre:", error);
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert(
                    "An error occurred while adding the genre. Please try again later."
                );
            }
        }
    };

    const addActor = async () => {
        try {
            if (!newActorName || newActorName.trim() === "") {
                throw new Error(
                    "The newActorName is required and cannot be empty."
                );
            }
            const response = await axios.post(
                `https://localhost:44398/add-actor`,
                newActorName,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                alert("Actor added successfully.");
                setNewActor("");
                setIsAddingActor(false);
                fetchAllActors();
            } else {
                alert("Failed to add actor.");
            }
        } catch (error) {
            console.error("Error adding actor:", error);
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert(
                    "An error occurred while adding the actor. Please try again later."
                );
            }
        }
    };

    const addDirector = async () => {
        try {
            if (!newDirectorName || newDirectorName.trim() === "") {
                throw new Error(
                    "The newDirectorName is required and cannot be empty."
                );
            }
            const response = await axios.post(
                `https://localhost:44398/add-director`,
                newDirectorName,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                alert("Director added successfully.");
                setNewDirector("");
                setIsAddingDirector(false);
                fetchAllDirectors();
            } else {
                alert("Failed to add Director.");
            }
        } catch (error) {
            console.error("Error adding Director:", error);
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert(
                    "An error occurred while adding the Director. Please try again later."
                );
            }
        }
    };

    const deleteUser = async (userId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this account? This action cannot be undone."
        );
        if (!confirmDelete) return;
        try {
            const response = await axios.delete(
                `https://localhost:44398/delete-account/${userId}`
            );
            alert(response.data.message);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account. Please try again.");
        }
    };

    const deleteGenre = async (genreId) => {
      try {
        const response = await axios.delete(`https://localhost:44398/delete-genre/${genreId}`);
        alert(response.data.message); 
        fetchAllGenres(); 
      } catch (error) {
        console.error("Error deleting genre:", error);
        alert("Error deleting genre");
      }
    };

    const deleteActor = async (actorId) => {
      try {
        const response = await axios.delete(`https://localhost:44398/delete-actor/${actorId}`);
        alert(response.data.message); 
        fetchAllActors(); 
      } catch (error) {
        console.error("Error deleting actor:", error);
        alert("Error deleting actor");
      }
    };
    
    const deleteDirector = async (directorId) => {
      try {
        const response = await axios.delete(`https://localhost:44398/delete-director/${directorId}`);
        alert(response.data.message); 
        fetchAllDirectors(); 
      } catch (error) {
        console.error("Error deleting director:", error);
        alert("Error deleting director");
      }
    };

    const controlReview = async (reviewId) => {
        try {
            const responseMessage = await movieService.controlReview(reviewId);
            alert(responseMessage);
            if (selectedMovie) fetchReviews(selectedMovie.movieId);
        } catch (error) {
            console.error("Error controlling review:", error);
        }
    };

    useEffect(() => {
        if (isManagingActors) {
            fetchAllActors();
        }
    }, [isManagingActors]);

    useEffect(() => {
        if (isManagingGenres) {
            fetchAllGenres();
        }
    }, [isManagingGenres]);

    useEffect(() => {
        if (isManagingDirectors) {
            fetchAllDirectors();
        }
    }, [isManagingDirectors]);

    useEffect(() => {
        fetchAllGenres();
    }, []);

    useEffect(() => {
        fetchAllActors();
    }, []);

    const handleMovieSelect = async (movie) => {
        setSelectedMovie(movie);
        fetchReviews(movie.movieId);
        fetchGenres(movie.movieId);
        fetchDirector(movie.movieId);
        fetchActors(movie.movieId);
    };

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>

            <div className="admin-buttons">
                <button
                    onClick={() => setIsManagingReviews(!isManagingReviews)}
                >
                    {isManagingReviews
                        ? "Close Reviews Management"
                        : "Manage Reviews"}
                </button>
                <button
                    onClick={() => {
                        setIsManagingUsers(!isManagingUsers);
                        if (!isManagingUsers) fetchUsers();
                    }}
                >
                    {isManagingUsers ? "Close User Management" : "Manage Users"}
                </button>
                <button onClick={() => setIsManagingMovies(!isManagingMovies)}>
                    {isManagingMovies
                        ? "Close Movie Management"
                        : "Manage Movies"}
                </button>
                <button onClick={() => setIsManagingGenres(!isManagingGenres)}>
                    {isManagingGenres
                        ? "Close Genre Management"
                        : "Manage Genres"}
                </button>
                <button
                    onClick={() => setIsManagingDirectors(!isManagingDirectors)}
                >
                    {isManagingDirectors
                        ? "Close Director Management"
                        : "Manage Directors"}
                </button>
                <button onClick={() => setIsManagingActors(!isManagingActors)}>
                    {isManagingActors
                        ? "Close Actor Management"
                        : "Manage Actors"}
                </button>
            </div>

            {/* Managing Reviews */}
            {isManagingReviews && (
                <div className="admin-section admin-reviews">
                    <h2>Select a Movie to Manage Reviews</h2>
                    <div className="movie-list">
                        {movies.length === 0 ? (
                            <p>No movies available</p>
                        ) : (
                            movies.map((movie) => (
                                <button
                                    key={movie.movieId}
                                    onClick={() => handleMovieSelect(movie)}
                                >
                                    {movie.movieName}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {isManagingReviews && selectedMovie && (
                <div className="admin-section">
                    <h3>Reviews for {selectedMovie.movieName}</h3>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((review) => (
                                <li key={review.reviewId}>
                                    <strong>{review.user.username}</strong>
                                    <p>{review.reviewtext}</p>
                                    <p>
                                        <em>Rating: {review.rating}</em>
                                    </p>
                                    <button
                                        onClick={() =>
                                            controlReview(review.reviewId)
                                        }
                                    >
                                        Delete Review
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reviews available.</p>
                    )}
                </div>
            )}

            {/* Managing Users */}
            {isManagingUsers && (
                <div className="admin-section admin-users">
                    <h2>Manage Users</h2>
                    {users.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Join Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.userId}>
                                        <td>{user.userId}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.joinDate}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    deleteUser(user.userId)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No users available.</p>
                    )}
                </div>
            )}

            {/* Managing Movies */}
            {isManagingMovies && (
                <div className="admin-section admin-movies">
                    <h2>Manage Movies</h2>
                    <div className="movie-list">
                        {movies.length === 0 ? (
                            <p>No movies available</p>
                        ) : (
                            <div>
                                {movies.map((movie) => (
                                    <button
                                        key={movie.movieId}
                                        onClick={() => handleMovieSelect(movie)}
                                    >
                                        {movie.movieName}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedMovie && (
                        <div className="selected-movie">
                            <img
                                src={selectedMovie.imageurl}
                                alt={selectedMovie.movieName}
                            />
                            <div className="selected-movie-details">
                                <h4>{selectedMovie.movieName}</h4>
                                <p>
                                    <strong>Description:</strong>{" "}
                                    {selectedMovie.description}
                                </p>
                                <p>
                                    <strong>Genres:</strong> {genres.join(", ")}
                                </p>
                                <p>
                                    <strong>Director:</strong> {director}
                                </p>
                                <p>
                                    <strong>Actors:</strong> {actors.join(", ")}
                                </p>
                                <p>
                                    <strong>Score:</strong>{" "}
                                    {selectedMovie.movieScore}
                                </p>
                                <button
                                    className="admin-buttons"
                                    onClick={async () => {
                                        const confirmDelete = window.confirm(
                                            `Are you sure you want to delete "${selectedMovie.movieName}"?`
                                        );
                                        if (confirmDelete) {
                                            try {
                                                await movieService.deleteMovie(
                                                    selectedMovie.movieId
                                                );
                                                alert(
                                                    `Movie "${selectedMovie.movieName}" deleted successfully.`
                                                );
                                                setMovies(
                                                    movies.filter(
                                                        (movie) =>
                                                            movie.movieId !==
                                                            selectedMovie.movieId
                                                    )
                                                );
                                                setSelectedMovie(null);
                                            } catch (error) {
                                                alert("Error deleting movie.");
                                            }
                                        }
                                    }}
                                >
                                    Delete Movie
                                </button>
                                <button
                                    className="admin-buttons"
                                    onClick={async () => {
                                        navigate(
                                            `/edit-movie/${selectedMovie.movieId}`
                                        );
                                    }}
                                >
                                    Edit Movie
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Managing Genres */}
            {isManagingGenres && (
                <div className="admin-section admin-genres">
                    <h2>Manage Genres</h2>

                    {/* Add New Genre Button */}
                    <button onClick={() => setIsAddingGenre(true)}>
                        Add New Genre
                    </button>

                    {/* Add New Genre Input Section */}
                    {isAddingGenre && (
                        <div className="add-genre-form">
                            <input
                                type="text"
                                value={newGenreName}
                                onChange={(e) => setNewGenre(e.target.value)}
                                placeholder="Enter genre name"
                            />
                            <button onClick={addGenre}>Add Genre</button>
                            <button onClick={() => setIsAddingGenre(false)}>
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Genre Table */}
                    {allGenres.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Genre Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allGenres.map((genre) => (
                                    <tr key={genre.genreId}>
                                        <td>{genre.genreId}</td>
                                        <td>{genre.genreName}</td>
                                        <td>
                                          <button onClick={() => deleteGenre(genre.genreId)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No genres available.</p>
                    )}
                </div>
            )}

            {/* Managing Directors */}
            {isManagingDirectors && (
                <div className="admin-section admin-directors">
                    <h2>Manage Directors</h2>
                    {/* Add New Directors Button */}
                    <button onClick={() => setIsAddingDirector(true)}>
                        Add New Director
                    </button>

                    {/* Add New Directors Input Section */}
                    {isAddingDirector && (
                        <div className="add-director-form">
                            <input
                                type="text"
                                value={newDirectorName}
                                onChange={(e) => setNewDirector(e.target.value)}
                                placeholder="Enter director name"
                            />
                            <button onClick={addDirector}>Add Director</button>
                            <button onClick={() => setIsAddingDirector(false)}>
                                Cancel
                            </button>
                        </div>
                    )}

                    {allDirectors.length > 0 ? (
                        <div className="director-list">
                            {allDirectors.map((director) => (
                                <div
                                    key={director.directorId}
                                    className="director-card"
                                >
                                    <h3>{director.directorName}</h3>
                                    <p>
                                        <strong>Biography:</strong>{" "}
                                        {director.biography ||
                                            "No biography available."}
                                    </p>
                                    <p>
                                        <strong>Awards:</strong>{" "}
                                        {director.awards || "No awards listed."}
                                    </p>
                                    <p>
                                        <strong>Nationality:</strong>{" "}
                                        {director.nationality || "Unknown"}
                                    </p>
                                    <div className="director-actions">
                                        <button
                                            className="admin-buttons"
                                            onClick={async () => { deleteDirector(director.directorId)}}
                                        >Delete Director
                                        </button>
                                        <button
                                            className="admin-buttons"
                                            onClick={async () => {
                                                navigate(
                                                    `/edit-director/${director.directorId}`
                                                );
                                            }}
                                        >
                                            Edit Director
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No directors available.</p>
                    )}
                </div>
            )}

            {/* Managing Actors */}
            {isManagingActors && (
                <div className="admin-section admin-actors">
                    <h2>Manage Actors</h2>
                    {/* Add New Actor Button */}
                    <button onClick={() => setIsAddingActor(true)}>
                        Add New Actor
                    </button>

                    {/* Add New Actor Input Section */}
                    {isAddingActor && (
                        <div className="add-actor-form">
                            <input
                                type="text"
                                value={newActorName}
                                onChange={(e) => setNewActor(e.target.value)}
                                placeholder="Enter actor name"
                            />
                            <button onClick={addActor}>Add Actor</button>
                            <button onClick={() => setIsAddingActor(false)}>
                                Cancel
                            </button>
                        </div>
                    )}

                    {allActors.length > 0 ? (
                        <div className="actor-list">
                            {allActors.map((actor) => (
                                <div key={actor.actorId} className="actor-card">
                                    <h3>{actor.actorName}</h3>
                                    <p>
                                        <strong>Biography:</strong>{" "}
                                        {actor.biography ||
                                            "No biography available."}
                                    </p>
                                    <p>
                                        <strong>Awards:</strong>{" "}
                                        {actor.awards || "No awards listed."}
                                    </p>
                                    <p>
                                        <strong>Nationality:</strong>{" "}
                                        {actor.nationality || "Unknown"}
                                    </p>
                                    <div className="actor-actions">
                                        <button
                                            className="admin-buttons"
                                            onClick={async () => { deleteActor(actor.actorId)}}
                                        >Delete Actor
                                        </button>
                                        <button
                                            className="admin-buttons"
                                            onClick={async () => {
                                                navigate(
                                                    `/edit-actor/${actor.actorId}`
                                                );
                                            }}
                                        >
                                            Edit Actor
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No actors available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;
