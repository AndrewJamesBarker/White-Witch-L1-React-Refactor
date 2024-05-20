import React, { useState } from 'react';
import axios from 'axios';
import "../../assets/CSS/layout.css";


const SignIn = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3001/api/users', {
          username,
          email,
          password,
          gameState: {
            currentChapter: { level: 1, completed: false},
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
        console.log('User created:', response.data);
        // Redirect to game or dashboard page after successful sign-in
      } catch (err) {
        setError(err.response.data.message || 'Error creating user');
      }
    };
          
  return (
    <div class="flexContainer">
    <h2>Sign In</h2>
    {error && <p className="errorMessage">{error}</p>}

    <form onSubmit={handleSubmit}>
      <div class="inputGroup">
        <label>Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
      </div>
      <div class="inputGroup">
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div class="inputGroup">
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Sign In</button>
    </form>
  </div>
  
  );
};

export default SignIn;
