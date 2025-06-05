import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        {/* Left side - Game info */}
        <div className="footer-brand">
          <span>White Witch © {currentYear}</span>
        </div>

        {/* Right side - Legal links */}
        <div className="footer-links">
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