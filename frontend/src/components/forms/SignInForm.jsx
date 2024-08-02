import React, { useState, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lowerCaseEmail = email.toLowerCase();

    if (!executeRecaptcha) {
      console.error("Execute recaptcha not yet available");
      setError("reCAPTCHA not ready. Please try again later.");
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("login");
      const response = await api.post("/api/users/auth/login", {
        email: lowerCaseEmail,
        password,
        "g-recaptcha-response": recaptchaToken,
      });
      const { user } = response.data;
      console.log("User data received:", user); // Log the user data for debugging
      login(user); // Call the login function with the user data
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Invalid email or password.";
      setError(errorMessage);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const handleNoReg = () => {
    navigate("/");
  };

  return (
    <div className="flexContainer">
      <h2 className="blueText">Sign In</h2>
      {error && <p className="errorMessage">{error}</p>}
      <div className="formFieldWidthControl">
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label>Email</label>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="inputGroup">
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <small>
            This site is protected by reCAPTCHA and the Google
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and
            <a href="https://policies.google.com/terms">
              Terms of Service
            </a>{" "}
            apply.
          </small>
          <button className="margin-btm-1" type="submit">
            Sign In
          </button>
          <p className="boldText paddingMarginReset">
            Don't have an account yet?
          </p>
          <button
            className="margin-btm-1"
            type="button"
            onClick={handleRegisterRedirect}
          >
            Register
          </button>
          <button type="button" onClick={handleNoReg}>
            Play
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
