import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import './Profile.css';
import axios from 'axios';

const Profile = () => {
    const { user, isLoggedIn, fetchUserProfile } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        name: user?.name || '',
        email: user?.email || '',
        age: user?.age || '',
        gender: user?.gender || '',
    });
    const [profilePicture, setProfilePicture] = useState(null); // File object
    const [preview, setPreview] = useState(user?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'); // Preview URL
    const [reviews, setReviews] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // State for controlling visibility of each section
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);
    const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

    useEffect(() => {
        const checkUserState = async () => {
            if (!user) {
                const storedUserEmail =
                    JSON.parse(localStorage.getItem('user'))?.email ||
                    JSON.parse(sessionStorage.getItem('user'))?.email;

                if (storedUserEmail) {
                    setLoading(true);
                    await fetchUserProfile(storedUserEmail);
                    setLoading(false);
                } else {
                    window.location.href = '/login';
                }
            } else {
                setLoading(false);
            }
        };

        checkUserState();
    }, [isLoggedIn, user, fetchUserProfile]);

    const fetchUserFavorites = async (userId) => {
        try {
            const response = await axios.get(`https://localhost:44398/user-favorites/${userId}`);
            if (response.data) {
                setFavorites(response.data); // Update the state directly
            } else {
                console.error('No favorites found.');
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const fetchUserReviews = async(userId) =>{
        try {
            const response = await axios.get(`https://localhost:44398/user-reviews/${userId}`);
            if(response.data)
            {
                setReviews(response.data);
            }
            else
            {
                console.error('No reviews found. ');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }

    const fetchUserWatchlist = async(userId) =>{
        try {
            const response = await axios.get(`https://localhost:44398/user-watchlist/${userId}`);
            if(response.data)
                {
                    setWatchlist(response.data);
                }
                else
                {
                    console.error('Watchlist is empty. ');
                }
            
        } catch (error) {
            console.error('Error fetching Watchlist:', error);
        }
    }
    
    
    if (loading) {
        return <div>Loading...</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser({
            ...updatedUser,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', updatedUser.name);
            formData.append('email', updatedUser.email);
            formData.append('age', updatedUser.age || '');
            formData.append('gender', updatedUser.gender || '');
            if (profilePicture) {
                formData.append('profilePicture', profilePicture); 
            }

            const response = await axios.put('https://localhost:44398/api/user/edit-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert(response.data.message);
            setEditing(false);
            await fetchUserProfile(updatedUser.email);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const toggleEditing = () => {
        setEditing(!editing);
    };

    // Toggle functions for expandable sections
    const toggleReviews = () => {
        setIsReviewsOpen(!isReviewsOpen);
        if(!isReviewsOpen){
            fetchUserReviews(user.userId);
        }
    }
    const toggleWatchlist = () =>{
        setIsWatchlistOpen(!isWatchlistOpen);
        if(!isWatchlistOpen){
            fetchUserWatchlist(user.userId);
        }
    } 
    const toggleFavorites = () => {
        setIsFavoritesOpen(!isFavoritesOpen);
        if (!isFavoritesOpen) {
            fetchUserFavorites(user.userId); // Fetch and set favorites
        }
    };
    

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-picture-container">
                    <img
                        src={preview}
                        alt="Profile"
                        className="profile-picture"
                        onError={(e) => (e.target.src = '/default-profile-pic.jpg')}
                    />
                </div>
            </div>
    
            <h1>Profile</h1>
            {editing ? (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="profile-info">
                        <label>
                            <strong>Name:</strong>
                            <input
                                type="text"
                                name="name"
                                value={updatedUser.name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            <strong>Email:</strong>
                            <input
                                type="email"
                                name="email"
                                value={updatedUser.email}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <label>
                            <strong>Age:</strong>
                            <input
                                type="number"
                                name="age"
                                value={updatedUser.age}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <strong>Gender:</strong>
                            <select
                                name="gender"
                                value={updatedUser.gender}
                                onChange={handleChange}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        <label>
                            <strong>Profile Picture:</strong>
                            <input
                                type="file"
                                name="profilePicture"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                    <button type="profile-edit-btn">Save Changes</button>
                </form>
            ) : (
                <div className="profile-info">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Age:</strong> {user?.age || 'Not available'}</p>
                    <p><strong>Gender:</strong> {user?.gender || 'Not specified'}</p>
                    <p><strong>Join Date:</strong> {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Not available'}</p>
                    <p><strong>Username:</strong> {user?.username}</p>
                </div>
            )}
    
            {/* Only show expandable sections when not editing */}
            {!editing && (
                <>
                    {/* Expandable Reviews Section */}
                    <div className="reviews">
                        <h3 onClick={toggleReviews} style={{ cursor: 'pointer' }}>
                            {isReviewsOpen ? 'Hide Reviews' : 'Show Reviews'}
                        </h3>
                        {isReviewsOpen && (
                            <ul>
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <li key={index}>
                                        <h4>{review.movieName}</h4>
                                        <p>{review.reviewtext}</p>
                                        <p>Score: {review.rating||'N/A'}</p>
                                        </li>
                                    ))
                                ) : (
                                    <p>No reviews available</p>
                                )}
                            </ul>
                        )}
                    </div>
    
                    {/* Expandable Watchlist Section */}
                    <div className="watchlist">
                        <h3 onClick={toggleWatchlist} style={{ cursor: 'pointer' }}>
                            {isWatchlistOpen ? 'Hide Watchlist' : 'Show Watchlist'}
                        </h3>
                        {isWatchlistOpen && (
                            <ul>
                                {watchlist.length > 0 ? (
                                    watchlist.map((watchlist, index) => (
                                        <li key={index}>
                                        <h4>{watchlist.movieName}</h4>
                                        <p>Score: {watchlist.movieScore||'N/A'}</p>
                                        </li>
                                    ))
                                ) : (
                                    <p>No movies in watchlist</p>
                                )}
                            </ul>
                        )}
                    </div>
    
                    {/* Expandable Favorites Section */}
                    <div className="favorites">
                        <h3 onClick={toggleFavorites} style={{ cursor: 'pointer' }}>
                            {isFavoritesOpen ? 'Hide Favorites' : 'Show Favorites'}
                        </h3>
                        {isFavoritesOpen && (
                            <ul>
                                {favorites.length > 0 ? (
                                    favorites.map((movie, index) => (
                                        <li key={index}>
                                        <h4>{movie.movieName}</h4>
                                        <p>{movie.description}</p>
                                        <img src={movie.imageurl} alt={movie.movieName} />
                                        <p>Score: {movie.movieScore||'N/A'}</p>
                                        </li>
                                    ))
                                ) : (
                                    <p>No favorites available</p>
                                )}
                            </ul>
                        )}
                    </div>
                </>
            )}
    
            <button className="profile-edit-btn" onClick={toggleEditing}>
                {editing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
        </div>
    );
}    

export default Profile;
