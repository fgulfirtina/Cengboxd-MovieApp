import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from './movieService'; // Assume this service has a method to fetch and update actors
import './Form.css';

const EditActorForm = () => {
    const { actorId } = useParams(); // Get actor ID from the URL
    const navigate = useNavigate(); // For navigation
    const [actor, setActor] = useState(null); // To store actor details
    const [name, setName] = useState('');
    const [biography, setBiography] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [nationality, setNationality] = useState('');
    const [awards, setAwards] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActorDetails = async () => {
            try {
                const fetchedActor = await movieService.getActorById(actorId); // Fetch actor details
                setActor(fetchedActor);
                setName(fetchedActor.actorName);
                setBiography(fetchedActor.biography);
                setBirthdate(fetchedActor.birtdate);
                setNationality(fetchedActor.nationality);
                setAwards(fetchedActor.awards);
            } catch (error) {
                alert('Error fetching actor details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchActorDetails();
    }, [actorId]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create the updated actor object
            const updatedActor = {
                id: actorId, // This may not be required if the ID is part of the endpoint
                ActorName: name, // Use the correct field name expected by the backend
                Biography: biography,
                Birthdate: birthdate,
                Nationality: nationality,
                Awards: awards,
            };
    
            // Send the update request
            await movieService.editActor(actorId, updatedActor);
            alert('Actor updated successfully!');
            navigate('/admin'); // Redirect to the actor list
        } catch (error) {
            // Handle error responses and display meaningful messages
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                alert(
                    Object.entries(errors)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('\n')
                );
            } else {
                alert('Error updating actor.');
            }
        }
    };
    
    if (isLoading) {
        return <p>Loading actor details...</p>;
    }

    return (
        <div className="form-container">
            <h2>Edit Actor</h2>
            {actor ? (
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name || ''}
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
                            value={birthdate || ''}
                            onChange={(e) => setBirthdate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nationality">Nationality:</label>
                        <input
                            type="text"
                            id="nationality"
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="awards">Awards:</label>
                        <textarea
                            id="awards"
                            value={awards}
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
            ) : (
                <p>Actor not found.</p>
            )}
        </div>
    );
};

export default EditActorForm;
