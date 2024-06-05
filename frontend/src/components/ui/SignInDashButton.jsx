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
    <button onClick={handleClick} className="button topRight">
      {isAuthenticated ? 'Dashboard' : 'Sign In'}
    </button>
  );
};

export default SignInDashButton;
