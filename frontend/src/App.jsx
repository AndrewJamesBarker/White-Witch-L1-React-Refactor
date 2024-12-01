import { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Game from "./components/core/Game";
import StartPage from "./components/pages/StartPage";
import NoPlayPage from "./components/utilities/NoPlayPage";
import SignInDashButton from "./components/ui/SignInDashButton";
import Dashboard from "./components/pages/Dashboard";
import PrivateRoute from "./components/pages/PrivateRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import RegisterForm from "./components/forms/RegisterForm";
import SignInForm from "./components/forms/SignInForm";
import VerifyEmail from "./components/pages/VerifyEmail";
import { GameStateProvider } from "./context/GameStateContext";

const AppContent = () => {
  const [startGame, setStartGame] = useState(null);
  const { logout, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const guestUser = JSON.parse(sessionStorage.getItem("guestUser"));
    if (user || guestUser) {
      setStartGame(true);
    } else {
      setStartGame(null);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.tagName === "SELECT"
      ) {
        return;
      }
      if (event.key === "y") {
        setStartGame(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleStartGame = (start) => {
    setStartGame(start);
  };

  return (
    <div className="app">
      <h1 className="sr-only">White Witch - A text-based adventure.</h1>{" "}
      {/* Invisible header for accessibility */}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              startGame === null ? (
                <StartPage onStartGame={handleStartGame} />
              ) : startGame ? (
                <Game />
              ) : (
                <NoPlayPage />
              )
            }
          />
          {/* Only apply reCAPTCHA to SignInForm and RegisterForm */}
          <Route
            path="/signin"
            element={
              <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
                <SignInForm />
              </GoogleReCaptchaProvider>
            }
          />
          <Route
            path="/register"
            element={
              <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
                <RegisterForm />
              </GoogleReCaptchaProvider>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </main>
      {location.pathname !== "/dashboard" &&
        location.pathname !== "/signin" && <SignInDashButton />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <GameStateProvider>
        <Router>
          <AppContent />
        </Router>
      </GameStateProvider>
    </AuthProvider>
  );
};

export default App;
