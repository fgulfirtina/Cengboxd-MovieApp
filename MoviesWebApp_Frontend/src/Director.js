import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import movieService from './movieService';  // Adjust this import based on your actual service file
import './Actor.css';

const Director = () => {
  const { directorName } = useParams(); // Get actorName from URL
  const [directorDetails, setDirectorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch director details using the actorName
  const fetchDirectorDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieService.getDirectorDetails(directorName);  // Replace with the actual API call method
      setDirectorDetails(data);
    } catch (error) {
      setError('Error fetching director details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (directorName) {
      fetchDirectorDetails();
    }
  }, [directorName]);

  if (loading) return <div>Loading director details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="actor-details">
      {directorDetails ? (
        <>
          <h1>{directorDetails.directorName}</h1> {/* You can change this to director's name */}
          <p><strong>{directorDetails.directorName}</strong> </p> {/* Again, change to director's name */}
          <p><strong>Biography:</strong> {directorDetails.biography}</p>
          <p><strong>Born:</strong> {directorDetails.birtdate}</p>
          <p><strong>Awards:</strong> {directorDetails.awards}</p> {/* You can change this to "Directed Movies" */}
        </>
      ) : (
        <div>Director details not found.</div>
      )}
    </div>
  );
};

export default Director;
