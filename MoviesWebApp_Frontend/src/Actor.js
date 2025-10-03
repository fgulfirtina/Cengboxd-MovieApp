import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import movieService from './movieService';  // Adjust this import based on your actual service file
import './Actor.css';

const Actor = () => {
  const { actorName } = useParams(); // Get actorName from URL
  const [actorDetails, setActorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch actor details using the actorName
  const fetchActorDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieService.getActorDetails(actorName);  // Replace with the actual API call method
      setActorDetails(data);
    } catch (error) {
      setError('Error fetching actor details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (actorName) {
      fetchActorDetails();
    }
  }, [actorName]);

  if (loading) return <div>Loading actor details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="actor-details">
      {actorDetails ? (
        <>
          <h1>{actorDetails.actorName}</h1>
          <p><strong>{actorDetails.actorName}</strong> </p>
          <p><strong>Biography:</strong> {actorDetails.biography}</p>
          <p><strong>Born:</strong> {actorDetails.birtdate}</p>
          <p><strong>Awards:</strong> {actorDetails.awards}</p>
        </>
      ) : (
        <div>Actor details not found.</div>
      )}
    </div>
  );
};

export default Actor;
