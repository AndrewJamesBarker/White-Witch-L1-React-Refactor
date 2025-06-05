import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Footer from '../layout/Footer';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div>
      <div className="flex-container">
        <h2 className="blue-text">Account Information</h2>
        
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Account Details */}
          <div className="bg-gray-900/80 border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-4 text-xl">Profile Details</h3>
            
            <div className="space-y-3 text-white">
              <div className="flex items-center py-2 border-b border-white/10">
                <span className="font-medium w-40">Username:</span>
                <span className="text-blue-200">{user.username}</span>
              </div>
              
              <div className="flex items-center py-2 border-b border-white/10">
                <span className="font-medium w-40">Current Chapter:</span>
                <span className="text-blue-200">Level {user.gameState?.currentChapter?.level || 1}</span>
              </div>
              
              <div className="flex items-center py-2 border-b border-white/10">
                <span className="font-medium w-40">Lives Remaining:</span>
                <span className="text-blue-200">{user.gameState?.livesLeft || 3}</span>
              </div>
              
              <div className="flex items-center py-2 border-b border-white/10">
                <span className="font-medium w-40">Items Collected:</span>
                <span className="text-blue-200">{user.gameState?.items?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4 items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="modern-button"
            >
              Back to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/delete-account')}
              className="bg-red-600 hover:bg-red-700 border-2 border-red-400 
                       text-white font-bold px-6 py-3 rounded-xl
                       transition-all duration-200 hover:scale-105"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage; 