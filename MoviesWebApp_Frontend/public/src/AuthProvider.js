import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const fetchUserProfile = async (email, rememberMe = false) => {
        try {
            const response = await axios.post('https://localhost:44398/user-profile', { email });
            setUser(response.data);

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(response.data)); 
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return false;
        }
        return true; 
    };

    const login = async (userData, rememberMe = false) => {
        try {
            const response = await axios.post('https://localhost:44398/login', userData);

            if (response.status === 200) {
                const success = await fetchUserProfile(userData.email, rememberMe);
                if (success) {
                    setIsLoggedIn(true);
                }
                return success;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('https://localhost:44398/register', userData);
            if (response.status === 200) {
                setIsLoggedIn(true);
                await fetchUserProfile(userData.email);
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    useEffect(() => {
        const storedUser =
            localStorage.getItem('user') || sessionStorage.getItem('user');
        
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser); // Parse stored user data
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                // Clear corrupted data from storage
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
            }
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, user, login, logout, register, fetchUserProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
