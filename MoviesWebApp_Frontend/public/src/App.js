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
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
