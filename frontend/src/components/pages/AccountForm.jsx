import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import useHistory and Link from react-router-dom
import axios from 'axios';
import "../../assets/CSS/layout.css";

const AccountForm = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate(); // Use navigate to redirect to another page


  const emailRegex = /\S+@\S+\.\S+/;


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return; // Stop the submission if the email is not valid
    }
    try {
        const response = await axios.post(`${apiBaseUrl}/api/users`, {
            username,
            email,
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
        // console.log('User created:', response.data);
        // Set user to authenticated state
        login(); 
        // Redirect to game or dashboard page after successful sign-in
        navigate('/dashboard'); 

    } catch (err) {
        console.error('Submission error:', err);
        // robust error handling
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
        <input type="text" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required />
      </div>
      <div className="inputGroup">
        <label>Email</label>
        <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="inputGroup">
        <label>Password</label>
        <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
  
  );
};

export default AccountForm;
