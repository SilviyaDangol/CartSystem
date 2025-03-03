// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Changed to named import

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        try {
            return token ? jwtDecode(token) : null;
        } catch (error) {
            console.error('Invalid token in localStorage:', error);
            localStorage.removeItem('token'); // Clean up invalid token
            return null;
        }
    });

    const login = (userData) => {
        const { token } = userData; // Expecting token from login response
        if (!token) {
            throw new Error('No token provided during login');
        }
        localStorage.setItem('token', token);
        try {
            const decodedUser = jwtDecode(token); // Decode the JWT
            setUser(decodedUser);
        } catch (error) {
            console.error('Failed to decode token:', error);
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};