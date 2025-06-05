import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { defaultGameState } from "../../context/GameStateContext";
import api from "../../services/api";

const RegisterForm = () => {
  // const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const isValidEmail = (email) => validator.isEmail(email);

  useEffect(() => {
    const addRecaptchaLabels = () => {
      const recaptchaTextareas = document.querySelectorAll(
        ".g-recaptcha-response"
      );
      recaptchaTextareas.forEach((textarea, index) => {
        textarea.setAttribute(
          "aria-label",
          `Recaptcha verification field ${index + 1}`
        );
      });
    };

    const timeoutId = setTimeout(addRecaptchaLabels, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

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

    if (!executeRecaptcha) {
      setError("reCAPTCHA not ready. Please try again later.");
      return;
    }

    const recaptchaToken = await executeRecaptcha("register");

    // Load guest user data if available
    const guestUser = JSON.parse(sessionStorage.getItem("guestUser"));

    // Merge guest user state with default state if available, otherwise use defaultGameState
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
      const response = await api.post("/register", {
        username,
        email: lowerCaseEmail,
        password,
        gameState: mergedGameState,
        "g-recaptcha-response": recaptchaToken,
      });
      sessionStorage.removeItem("guestUser"); // Clear guest user data after registration
      navigate("/dashboard");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err.response?.data?.message || err.message || "Error creating user"
      );
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(""); // Reset error message when user modifies the input
  };

  return (
    <div>
      <div className="flex-container">
        <h2 className="blue-text">REGISTER</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-field-width-control">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
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
            <div className="input-group">
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
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={handleInputChange(setPassword)}
                required
              />
              <small>
                This site is protected by reCAPTCHA and the Google{" "}
                <a href="https://policies.google.com/privacy">Privacy Policy</a>{" "}
                and{" "}
                <a href="https://policies.google.com/terms">Terms of Service</a>{" "}
                apply.
              </small>
            </div>
            <button type="submit">Register</button>
            <button type="button" onClick={onDeclineRegister}>
              Back
            </button>
          </form>
          <p className="medium-text form-field-width-control margin-btm-1">
            Registering is free. Registering will allow you to progress to the
            next chapters and will save your progress. We will not share your info
            with third parties, but you will receive occasional emails regarding
            the progress of this game (which you can opt out of.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
