import React from 'react';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import MovieDetails from './MovieDetails';
import AuthProvider from './AuthProvider'; 
import Help from './Help';
import Profile from './Profile';
import Footer from './Footer';
import Admin from './Admin';
import EditMovieForm from './EditMovieForm';
import EditActorForm from './EditActorForm';
import EditDirectorForm from './EditDirectorForm';
import Actor from './Actor';
import Director from './Director';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/movie/:movieId" element={<MovieDetails />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:movieId" element={<MovieDetails />} /> 
          <Route path="/admin" element={<Admin />} />
          <Route path="/edit-movie/:movieId" element={<EditMovieForm />} />
          <Route path="/edit-actor/:actorId" element={<EditActorForm />} />
          <Route path="/edit-director/:directorId" element={<EditDirectorForm />} />
          <Route path="/actor/:actorName" element={<Actor />} />
          <Route path="/director/:directorName" element={<Director />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
