import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

const AuthContext = createContext(null);

// Helper function to get cookie options based on environment
const getCookieOptions = () => {
  const isDevelopment = import.meta.env.VITE_API_URL?.includes('localhost');
  return {
    secure: !isDevelopment, // false for localhost, true for production
    sameSite: isDevelopment ? 'Strict' : 'None' // Strict for dev, None for production
  };
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    const { email, token, ...userSafeData } = userData;
    const cookieOptions = getCookieOptions();
    
    setIsAuthenticated(true);
    setUser(userSafeData);
    sessionStorage.setItem('user', JSON.stringify(userSafeData));
    Cookies.set('token', token, cookieOptions);
    Cookies.set('email', email, cookieOptions);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // console.log('User logged in and stored in sessionStorage and cookies:', userSafeData);
  };

const logout = async () => {
  try {
    await api.post('/auth/logout', {}, { withCredentials: true });
    console.log('Logout API call succeeded.');
  } catch (err) {
    // console.error('Error during logout:', err);
  }

  // Now clear frontend state
  setIsAuthenticated(false);
  setUser(null);
  sessionStorage.removeItem('user');
  Cookies.remove('token');
  Cookies.remove('email');
  delete api.defaults.headers.common['Authorization'];

  // console.log('User logged out and removed from sessionStorage and cookies');
};


  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const token = Cookies.get('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // console.log('User loaded from sessionStorage:', JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
