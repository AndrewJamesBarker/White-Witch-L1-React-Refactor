import { useState, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
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
import PrivacyPolicyPage from "./components/pages/PrivacyPolicyPage";
import AccountPage from "./components/pages/AccountPage";
import DeleteAccount from "./components/account/DeleteAccount";
import { GameStateProvider } from "./context/GameStateContext";

const AppContent = () => {
  const [startGame, setStartGame] = useState(null);
  const { logout, user } = useAuth();
  const location = useLocation();
  const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "var(--primary-bg)", // Use CSS variable instead of hardcoded color
        paper: "#2a2a2a",   // Card or Paper background
      },
      text: {
        primary: "rgba(255, 255, 255, 0.87)", // Default text
        secondary: "rgba(255, 255, 255, 0.6)", // Secondary text
      },
    },
    typography: {
      fontFamily: "Raleway, sans-serif",
      fontWeight: 500,
      fontSize: 16,
    },
  });


  // .raleway{
  //   font-family: "Raleway", sans-serif;
  //   font-optical-sizing: auto;
  //   font-weight: 500;
  //   font-size: 1em;
  // }

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
                <SignInForm />
            }
          />
          <Route
            path="/register"
            element={
                <RegisterForm />
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
          </Route>
        </Routes>
      </main>
      </ThemeProvider>
      {location.pathname !== "/dashboard" &&
        location.pathname !== "/signin" && <SignInDashButton />}
    </div>
  );
};

const App = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
      <AuthProvider>
        <GameStateProvider>
          <Router>
            <AppContent />
          </Router>
        </GameStateProvider>
      </AuthProvider>
    </GoogleReCaptchaProvider>
  );
};

export default App;
