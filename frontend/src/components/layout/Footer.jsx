import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/40 border-t border-white/20 backdrop-blur-sm z-10">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center text-white/70 text-sm">
          
          {/* Left side - Game info */}
          <div className="mb-2 sm:mb-0">
            <span className="font-medium">White Witch</span>
            <span className="mx-2">•</span>
            <span>© 2024</span>
          </div>

          {/* Right side - Legal links */}
          <div className="flex space-x-4">
            <Link 
              to="/privacy-policy" 
              className="hover:text-white transition-colors duration-200 underline"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="hover:text-white transition-colors duration-200 underline"
            >
              Terms of Service
            </Link>
            <a 
              href="mailto:contact@whitewitch.game" 
              className="hover:text-white transition-colors duration-200 underline"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 