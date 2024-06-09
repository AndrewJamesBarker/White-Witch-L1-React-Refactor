import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "../../assets/CSS/layout.css";

const RegisterForm = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const emailRegex = /\S+@\S+\.\S+/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lowerCaseEmail = email.toLowerCase();
    if (!emailRegex.test(lowerCaseEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/register`, {
        username,
        email: lowerCaseEmail,
        password,
        gameState: {
          currentChapter: { level: 1, completed: false },
          items: ['laser pistol'],
          livesLeft: 3,
          chaptersCompleted: {
            chapterOne: false,
            chapterTwo: false,
            chapterThree: false,
            chapterFour: false,
            chapterFive: false,
            chapterSix: false,
            chapterSeven: false,
            chapterEight: false
          },
        }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response && err.response.data ? err.response.data.message : (err.message || 'Error creating user'));
    }
  };

  return (
    <div className="flexContainer">
      <h2>Register</h2>
      {error && <p className="errorMessage">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label>Username</label>
          <input 
            type="text" 
            autoComplete="username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="inputGroup">
          <label>Email</label>
          <input 
            type="email" 
            autoComplete="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="inputGroup">
          <label>Password</label>
          <input 
            type="password" 
            autoComplete="new-password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
