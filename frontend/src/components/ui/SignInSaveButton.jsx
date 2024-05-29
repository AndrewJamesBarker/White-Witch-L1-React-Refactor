import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInSaveButton = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/dashboard', { state: { isAuthenticated } });
    };

    return (
        <button onClick={handleClick} className="button topRight">
            {isAuthenticated ? 'Save' : 'Sign In'}
        </button>
    );
};

export default SignInSaveButton;
