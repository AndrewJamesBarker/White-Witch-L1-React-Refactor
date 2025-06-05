import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        {/* Left side - Game info */}
        <div className="footer-brand">
          <span>White Witch © {currentYear}</span>
        </div>

        {/* Right side - Links */}
        <div className="footer-links">
          {isAuthenticated && (
            <Link 
              to="/account" 
              className="footer-link"
            >
              Account
            </Link>
          )}
          <Link 
            to="/privacy-policy" 
            className="footer-link"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 