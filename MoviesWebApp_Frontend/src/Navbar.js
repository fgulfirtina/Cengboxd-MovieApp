import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import './Navbar.css';

function Navbar() {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">CENGBOXD</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/help">Help</Link></li>
        {isLoggedIn ? (
          <>
            {user?.usertype === 'admin' && ( // Corrected conditional rendering
              <li><Link to="/admin">Admin Panel</Link></li>
            )}
            <li><Link to="/profile">Profile</Link></li>
            <li>
              <Link to="/" onClick={handleLogout}>Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
