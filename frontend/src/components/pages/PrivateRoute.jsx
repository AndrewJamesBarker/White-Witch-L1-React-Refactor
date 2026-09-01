import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  // console.log('PrivateRoute isAuthenticated:', isAuthenticated);

  if (isAuthLoading) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute; 
