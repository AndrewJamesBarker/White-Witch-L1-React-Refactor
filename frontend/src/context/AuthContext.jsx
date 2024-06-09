import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    const { email, password, ...userSafeData } = userData; // Exclude email and password from user data
    setIsAuthenticated(true);
    setUser(userSafeData);
    localStorage.setItem('user', JSON.stringify(userSafeData));
    console.log('User logged in and stored in localStorage:', userSafeData);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    console.log('User logged out and removed from localStorage');
    await api.post('/api/users/auth/logout'); // Ensure server-side logout handling
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      console.log('User loaded from localStorage:', JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
