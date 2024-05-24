import React from 'react';

const SignInSaveButton = ({ isSignedIn, onSaveGame, onSignIn }) => {
  return (
    <button onClick={isSignedIn ? onSaveGame : onSignIn} className="button topRight">
      {isSignedIn ? 'Save' : 'Sign In'}
    </button>
  );
};

export default SignInSaveButton;
