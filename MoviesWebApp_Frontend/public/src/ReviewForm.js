import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthProvider';
import './ReviewForm.css';


const ReviewForm = ({ movieId }) => {
    const { user, isLoggedIn } = useContext(AuthContext);
    const [reviewText, setReviewText] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Memoized handleSubmit function to prevent unnecessary re-renders
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            setErrorMessage("You must be logged in to add a review.");
            return;
        }

        try {
            const response = await axios.post('https://localhost:44398/add-review', {
                UserId: user.userId, 
                MovieId: movieId,
                ReviewText: reviewText,
            });

            if (response.status === 200) {
                setSuccessMessage("Review added successfully!");
                setReviewText('');
            }
        } catch (error) {
            setErrorMessage("Failed to add review. Please try again later.");
            console.error("Error adding review:", error);
        }
    }, [reviewText, movieId, isLoggedIn, user]); // Dependencies to prevent unnecessary re-renders

    return (
        <div className="review-form-container">
            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="review-form">
                    <textarea
                        placeholder="Write your review here..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                    />
                    <button type="submit">Submit Review</button>
                </form>
            ) : (
                <p>Please log in to leave a review.</p>
            )}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ReviewForm;
