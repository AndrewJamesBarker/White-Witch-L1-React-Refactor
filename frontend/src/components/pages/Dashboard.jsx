import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SignInForm from '../forms/SignInForm';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
        <h1>Welcome, {user.username}!</h1>
        <button className="button">Save</button> 
        </>  
      ) : (
        <SignInForm />
      )}
    </div>
  );
};

export default Dashboard;
