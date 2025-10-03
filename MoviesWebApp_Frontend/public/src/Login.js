import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import './Form.css';

const Login = () => {
    const { login } = useContext(AuthContext); // Access the login function from AuthContext
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false); 
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous error messages

        try {
            // Attempt to login
            const isLoggedIn = await login(formData, rememberMe);
            
            // Check login status
            if (isLoggedIn) {
                navigate('/');  // Navigate only if login is successful
            } else {
                // Show error message if login fails
                setErrorMessage('Invalid email or password.');
            }
        } catch (error) {
            // Handle unexpected login errors
            setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h1 className="form-title">Login</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error messages */}
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <div className="remember-me-container">
                <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <button className="submit-button" type="submit">Login</button>
            <p className="helper-text">
                Don't have an account? <a href="/signup">Sign up</a>
            </p>
        </form>
    );
};

export default Login;
