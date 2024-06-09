import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lowerCaseEmail = email.toLowerCase();
    try {
      const response = await api.post('/api/users/auth/login', { email: lowerCaseEmail, password });
      const { user } = response.data;
      console.log('User data received:', user); // Log the user data for debugging
      login(user); // Call the login function with the user data
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleNoReg = () => {
    navigate('/');
  };

  return (
    <div className="flexContainer">
      <h2>Sign In</h2>
      {error && <p className="errorMessage">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label>Email:</label>
          <input 
            type="email" 
            autoComplete="username" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="inputGroup">
          <label>Password:</label>
          <input 
            type="password" 
            autoComplete="current-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button className='margin-btm-1' type="submit">Sign In</button>  
        <p className='boldText paddingMarginReset'>Don't have an account yet?</p>
        <button className='margin-btm-1' type="button" onClick={handleRegisterRedirect}>Register</button>
        {/* <p className='boldText paddingMarginReset'>Back to game.</p> */}
        <button type="button" onClick={handleNoReg}>Back</button>
      </form>
    </div>
  );
};

export default SignInForm;
