import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInDashButton = ({ onSaveGame }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  };

  return (
    <button onClick={handleClick} className="button topRight">
      {isAuthenticated ? 'Dashboard' : 'Sign In'}
    </button>
  );
};

export default SignInDashButton;
