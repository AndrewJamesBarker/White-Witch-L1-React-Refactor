import React from 'react';
import { useAuth } from '../../context/AuthContext';  // Adjust the path as necessary

const SignInSaveButton = ({ onSaveGame, onSignIn }) => {
    const { isAuthenticated } = useAuth();  // Getting the state from context

    return (
        <button onClick={isAuthenticated ? onSaveGame : onSignIn} className="button topRight">
            {isAuthenticated ? 'Save' : 'Sign In'}
        </button>
    );
};

export default SignInSaveButton;
