import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  useEffect(() => {
    const loadRecaptchaScript = () => {
      if (!document.querySelector('script[src="https://www.google.com/recaptcha/api.js?render=explicit"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = renderRecaptcha;
        document.body.appendChild(script);
      } else {
        renderRecaptcha();
      }
    };

    const renderRecaptcha = () => {
      if (window.grecaptcha && !recaptchaRef.current) {
        window.grecaptcha.ready(() => {
          recaptchaRef.current = window.grecaptcha.render('recaptcha', {
            sitekey: siteKey,
            callback: (token) => {
              setRecaptchaToken(token);
            }
          });
        });
      }
    };

    loadRecaptchaScript();
  }, [siteKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lowerCaseEmail = email.toLowerCase();
    try {
      const response = await api.post('/api/users/auth/login', { 
        email: lowerCaseEmail, 
        password, 
        'g-recaptcha-response': recaptchaToken 
      });
      const { user } = response.data;
      console.log('User data received:', user); // Log the user data for debugging
      login(user); // Call the login function with the user data
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Invalid email or password.';
      setError(errorMessage);
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
        <div id="recaptcha" className="g-recaptcha"></div>
        <button className='margin-btm-1' type="submit">Sign In</button>  
        <p className='boldText paddingMarginReset'>Don't have an account yet?</p>
        <button className='margin-btm-1' type="button" onClick={handleRegisterRedirect}>Register</button>
        <button type="button" onClick={handleNoReg}>Play</button>
      </form>
    </div>
  );
};

export default SignInForm;
