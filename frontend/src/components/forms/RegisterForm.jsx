import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/CSS/layout.css";
import validator from "validator";

const RegisterForm = () => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [error, setError] = useState("");
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

    return () => {
      // Clear reCAPTCHA on component unmount
      if (recaptchaRef.current) {
        window.grecaptcha.reset(recaptchaRef.current);
        recaptchaRef.current = null;
      }
    };
  }, [siteKey]);

  const isValidEmail = (email) => validator.isEmail(email);

  const onDeclineRegister = () => {
    navigate("/signin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lowerCaseEmail = email.toLowerCase();
    if (!isValidEmail(lowerCaseEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }

    const defaultGameState = {
      currentChapter: { level: 1, completed: false },
      items: ["laser pistol"],
      livesLeft: 3,
      chaptersCompleted: {
        chapterOne: false,
        chapterTwo: false,
        chapterThree: false,
        chapterFour: false,
        chapterFive: false,
        chapterSix: false,
        chapterSeven: false,
        chapterEight: false,
      },
    };

    const guestUser = JSON.parse(sessionStorage.getItem("guestUser"));

    const mergedGameState = guestUser
      ? {
          currentChapter:
            guestUser.gameState.currentChapter ||
            defaultGameState.currentChapter,
          items: Array.from(
            new Set([
              ...defaultGameState.items,
              ...(guestUser.gameState.items || []),
            ])
          ),
          livesLeft:
            guestUser.gameState.livesLeft !== undefined
              ? guestUser.gameState.livesLeft
              : defaultGameState.livesLeft,
          chaptersCompleted: {
            ...defaultGameState.chaptersCompleted,
            ...guestUser.gameState.chaptersCompleted,
          },
        }
      : defaultGameState;

    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/register`, {
        username,
        email: lowerCaseEmail,
        password,
        gameState: mergedGameState,
        'g-recaptcha-response': recaptchaToken,
      });
      sessionStorage.removeItem("guestUser"); // Clear guest user data after registration
      navigate("/dashboard");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err.response && err.response.data
          ? err.response.data.message
          : err.message || "Error creating user"
      );
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(""); // Reset error message when user modifies the input
  };

  return (
    <div className="flexContainer">
      <h2 className="blueText">Register</h2>
      
      {error && <p className="errorMessage">{error}</p>}
      <div className="formFieldWidthControl">
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={handleInputChange(setUsername)}
              required
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              required
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={handleInputChange(setPassword)}
              required
            />
          </div>
          <div id="recaptcha" className="g-recaptcha"></div>
          <button type="submit">Register</button>
          <button type="button" onClick={onDeclineRegister}>
            Back
          </button>
        </form>
        <p className="mediumText formTextWidthControl margin-btm-1">
          Registering will automatically backup your progress as you play. You
          will also receive a free download code for my album White Witch! I will
          not share your info with third parties, but you will receive occasional
          emails regarding the progress of this game (which you can opt out of.)
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
