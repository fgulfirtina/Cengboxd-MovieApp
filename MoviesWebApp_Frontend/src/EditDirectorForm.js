import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from './movieService'; // Service with methods to fetch and update directors
import './Form.css';

const EditDirectorForm = () => {
    const { directorId } = useParams(); // Get the director ID from the URL
    const navigate = useNavigate(); // For navigation
    const [director, setDirector] = useState(null); // To store director details
    const [name, setName] = useState('');
    const [biography, setBiography] = useState('');
    const [birthdate, setBirthdate] = useState(''); // Birthdate can be empty
    const [nationality, setNationality] = useState('');
    const [awards, setAwards] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch director details when component loads
    useEffect(() => {
        const fetchDirectorDetails = async () => {
            try {
                const fetchedDirector = await movieService.getDirectorById(directorId);
                setDirector(fetchedDirector);
                setName(fetchedDirector.directorName || '');
                setBiography(fetchedDirector.biography || '');
                setBirthdate(fetchedDirector.birthdate || ''); // Handle nullable birthdate
                setNationality(fetchedDirector.nationality || '');
                setAwards(fetchedDirector.awards || '');
            } catch (error) {
                alert('Error fetching director details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDirectorDetails();
    }, [directorId]);

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create the updated director object
            const updatedDirector = {
                directorName: name,
                biography,
                birthdate: birthdate || null, // Set birthdate to null if it's empty
                nationality: nationality || null,
                awards: awards || null
            };

            // Send the update request
            await movieService.editDirector(directorId, updatedDirector);
            alert('Director updated successfully!');
            navigate('/admin'); // Redirect to the admin page
        } catch (error) {
            alert('Error updating director.');
        }
    };

    // Handle loading state
    if (isLoading) {
        return <p>Loading director details...</p>;
    }

    // Handle case where director is not found
    if (!director) {
        return <p>Director not found.</p>;
    }

    return (
        <div className="form-container">
            <h2>Edit Director</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="biography">Biography:</label>
                    <textarea
                        id="biography"
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="birthdate">Birthdate:</label>
                    <input
                        type="date"
                        id="birthdate"
                        value={birthdate || ''} // Allow empty input for birthdate
                        onChange={(e) => setBirthdate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nationality">Nationality:</label>
                    <input
                        type="text"
                        id="nationality"
                        value={nationality|| ''}
                        onChange={(e) => setNationality(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="awards">Awards:</label>
                    <textarea
                        id="awards"
                        value={awards|| ''}
                        onChange={(e) => setAwards(e.target.value)}
                    />
                </div>
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
    );
};

export default EditDirectorForm;
