import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInDashButton = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(isAuthenticated ? '/dashboard' : '/signin');
  };

  return (
    <button 
      onClick={handleClick} 
      className="fixed top-4 right-4 z-20
                 bg-gray-900/80 hover:bg-blue-600/90 active:bg-blue-700/90
                 border border-gray-600/50 hover:border-blue-400/70
                 rounded-lg px-4 py-2 text-sm font-medium text-white
                 backdrop-blur-md shadow-lg hover:shadow-blue-500/20
                 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
    >
      {isAuthenticated ? 'Dashboard' : 'Sign In'}
    </button>
  );
};

export default SignInDashButton;
