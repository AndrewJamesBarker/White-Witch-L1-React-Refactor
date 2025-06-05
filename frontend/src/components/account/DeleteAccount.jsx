import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DeleteAccount = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleDeleteRequest = () => {
    setShowConfirmation(true);
    setError('');
  };

  const handleConfirmDelete = async () => {
    if (confirmText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" exactly as shown to confirm.');
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete('/delete-account');
      
      // Log out the user and redirect
      await logout();
      navigate('/', { 
        state: { 
          message: 'Your account has been permanently deleted.' 
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting account. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmText('');
    setError('');
  };

  if (!showConfirmation) {
    return (
      <div>
        <div className="flex-container">
          <h2 className="text-white text-2xl font-bold">Delete Account</h2>
          
          <div className="max-w-2xl mx-auto p-6 space-y-4">
            <div className="bg-gray-900/80 border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4">⚠️ Warning: This action cannot be undone</h3>
              
              <div className="text-white space-y-3 mb-6">
                <p>Deleting your account will permanently remove:</p>
                <ul className="list-disc list-inside space-y-1 text-base list-centered">
                  <li className="text-left">Your username and email</li>
                  <li className="text-left">All game progress and save data</li>
                  <li className="text-left">Chapter completions and current level</li>
                  <li className="text-left">Collected items and lives</li>
                  <li className="text-left">All saved notes</li>
                </ul>
              </div>

              <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4 mb-6">
                <p className="text-blue-200 text-base">
                  💡 <strong>Alternative:</strong> You can also just log out and not use your account. 
                  Your data will remain saved if you change your mind later.
                </p>
              </div>
            </div>

            <div className="flex space-y-4 flex-col items-center">
              <button
                onClick={handleDeleteRequest}
                className="bg-red-600 hover:bg-red-700 border-2 border-red-400 
                         text-white font-bold px-6 py-3 rounded-xl
                         transition-all duration-200 hover:scale-105"
              >
                I understand - Delete My Account
              </button>
              
              <button
                onClick={() => navigate('/account')}
                className="modern-button"
              >
                Cancel - Keep My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-container">
        <h2 className="text-white text-2xl font-bold">Confirm Account Deletion</h2>
        
        <div className="max-w-md mx-auto p-6">
          <div className="bg-red-900/50 border-2 border-red-400/50 rounded-xl p-6 backdrop-blur-sm mb-6">
            <h3 className="text-red-200 font-bold mb-4">🚨 Final Confirmation Required</h3>
            
            <p className="text-red-100 mb-4">
              This will permanently delete your account and all data. This action cannot be reversed.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="confirmText" className="block text-red-100 font-bold mb-2">
                  Type exactly: <span className="text-red-300">DELETE MY ACCOUNT</span>
                </label>
                <input
                  id="confirmText"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full p-3 border border-red-400/50 rounded-lg 
                           bg-gray-900/50 text-white focus:border-red-300 focus:outline-none"
                  placeholder="DELETE MY ACCOUNT"
                  disabled={isDeleting}
                />
              </div>
              
              {error && (
                <p className="text-red-300 text-base font-medium">{error}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting || confirmText !== 'DELETE MY ACCOUNT'}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-200
                        ${confirmText === 'DELETE MY ACCOUNT' && !isDeleting
                          ? 'bg-red-600 hover:bg-red-700 border-2 border-red-400 text-white hover:scale-105'
                          : 'bg-gray-600 border-2 border-gray-400 text-gray-300 cursor-not-allowed'
                        }`}
            >
              {isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isDeleting}
              className="modern-button"
            >
              Cancel - Keep My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount; 