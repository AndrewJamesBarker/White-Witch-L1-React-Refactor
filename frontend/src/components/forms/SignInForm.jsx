import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/auth/login`, { email, password });
      console.log('Login response:', response.data);
      login(response.data); // Pass the response data to the login function
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="flexContainer">
      <h2>Sign In</h2>
      {error && <p className="errorMessage">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="inputGroup">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Sign In</button>
        
        <p className='boldText paddingMarginReset'>Don't have an account yet?</p>
        <button type="button" onClick={handleRegisterRedirect}>Register</button>
      </form>
    </div>
  );
};

export default SignInForm;
