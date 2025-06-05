import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Wait for reCAPTCHA to render and target the textarea field
    const addRecaptchaLabels = () => {
      const recaptchaTextareas = document.querySelectorAll('.g-recaptcha-response');
      recaptchaTextareas.forEach((textarea, index) => {
        // Add aria-label for accessibility
        textarea.setAttribute('aria-label', `Recaptcha verification field ${index + 1}`);
      });
    };

    // Ensure it's only run once reCAPTCHA has fully loaded
    const timeoutId = setTimeout(addRecaptchaLabels, 1000);

    // Cleanup timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

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
      const response = await api.post("/auth/login", {
        email: lowerCaseEmail,
        password,
        "g-recaptcha-response": recaptchaToken,
      });
      const { user } = response.data;
      // console.log("User data received:", user); // Log the user data for debugging
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

  return (
    <div>
      <div className="flex-container">
        <h2 className="blue-text">LOGIN</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-field-width-control">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
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
              <a href="https://policies.google.com/terms">Terms of Service</a> apply.
            </small>
            <button className="margin-btm-1" type="submit">
              Login
            </button>
            <p className="bold-text padding-margin-reset">
              Don't have an account yet?
            </p>
            <button
              className="margin-btm-1"
              type="button"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button type="button" onClick={() => navigate("/")}>
              Play
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
