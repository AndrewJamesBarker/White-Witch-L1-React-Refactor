import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

const AuthContext = createContext(null);

const clearLegacyClientAuth = () => {
  Cookies.remove('token');
  Cookies.remove('email');
  delete api.defaults.headers.common['Authorization'];
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const persistUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const login = (userData) => {
    setIsAuthenticated(true);
    persistUser(userData);
    clearLegacyClientAuth();
  };

  const updateUser = (userData) => {
    persistUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
      console.log('Logout API call succeeded.');
    } catch (err) {
      // console.error('Error during logout:', err);
    }

    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem('user');
    clearLegacyClientAuth();
  };


  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await api.get('/auth/me', { withCredentials: true });

        if (!isMounted) {
          return;
        }

        persistUser(response.data.user);
        setIsAuthenticated(true);
        clearLegacyClientAuth();
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setIsAuthenticated(false);
        setUser(null);
        sessionStorage.removeItem('user');
        clearLegacyClientAuth();
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthLoading, user, login, logout, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
