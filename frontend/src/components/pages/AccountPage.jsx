import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Footer from '../layout/Footer';
import {
  isPasswordPolicyValid,
  passwordPolicyMessage,
} from '../utilities/passwordPolicy';

const AccountPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setUsername(user.username || '');
    setEmail(user.email || '');
  }, [user]);

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const trimmedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const currentEmail = (user.email || '').toLowerCase();
    const usernameChanged = trimmedUsername && trimmedUsername !== user.username;
    const emailChanged = normalizedEmail && normalizedEmail !== currentEmail;
    const passwordChanged = Boolean(newPassword);

    if (!usernameChanged && !emailChanged && !passwordChanged) {
      setMessage('No account changes to save.');
      return;
    }

    if ((emailChanged || passwordChanged) && !currentPassword) {
      setError('Current password is required to change your email or password.');
      return;
    }

    if (passwordChanged && newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (passwordChanged && !isPasswordPolicyValid(newPassword)) {
      setError(passwordPolicyMessage);
      return;
    }

    const payload = {};
    if (usernameChanged) {
      payload.username = trimmedUsername;
    }
    if (emailChanged) {
      payload.email = normalizedEmail;
    }
    if (passwordChanged) {
      payload.password = newPassword;
    }
    if (emailChanged || passwordChanged) {
      payload.currentPassword = currentPassword;
    }

    setIsSaving(true);

    try {
      const response = await api.patch('/auth/info', payload, {
        withCredentials: true,
      });

      updateUser(response.data.user);
      setMessage(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEmail(response.data.user.email || '');
      setUsername(response.data.user.username || '');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to update account information.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex-container">
        <h2 className="blue-text">Account Information</h2>
        {message && <p className="standard-text blue-text">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Account Details */}
          <div className="bg-gray-900/80 border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-4 text-xl">Profile Details</h3>
            
            <div className="space-y-3 text-white">
              <div className="flex items-center py-2 border-b border-white/10">
                <span className="font-medium">Username:</span>
                <span className="text-blue-200 margin-left-1">{user.username}</span>
              </div>

              <div className="flex items-center py-2 border-b border-white/10">
                <span className="font-medium">Email:</span>
                <span className="text-blue-200 margin-left-1">{user.email}</span>
              </div>

              <div className="flex items-center py-2 border-b border-white/10">
                <span className="font-medium">Verification Status:</span>
                <span className="text-blue-200 margin-left-1">
                  {user.isVerified ? 'Verified' : 'Pending verification'}
                </span>
              </div>

              {user.pendingEmail && (
                <div className="flex items-center py-2 border-b border-white/10">
                  <span className="font-medium">Pending New Email:</span>
                  <span className="text-blue-200 margin-left-1">{user.pendingEmail}</span>
                </div>
              )}
              
              <div className="flex items-center py-2 border-b border-white/10">
                <span className="font-medium">Current Chapter:</span>
                <span className="text-blue-200 margin-left-1">Level {user.gameState?.currentChapter?.level || 1}</span>
              </div>
              
              <div className="flex items-center py-2 border-b border-white/10">
                <span className="font-medium">Lives Remaining:</span>
                <span className="text-blue-200 margin-left-1">{user.gameState?.livesLeft || 3}</span>
              </div>
              
              <div className="flex items-center py-2 border-b border-white/10">
                <span className="font-medium">Items Collected:</span>
                <span className="text-blue-200 margin-left-1">{user.gameState?.items?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/80 border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-4 text-xl">Update Account</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-white">
              <div className="input-group">
                <label htmlFor="account-username">Username</label>
                <input
                  id="account-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="account-email">Email</label>
                <input
                  id="account-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <small>
                  Changing your email sends a verification link to the new address. Your login email does not change until you verify it.
                </small>
              </div>

              <div className="input-group">
                <label htmlFor="account-current-password">Current Password</label>
                <input
                  id="account-current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
                <small>Required when changing your email or password.</small>
              </div>

              <div className="input-group">
                <label htmlFor="account-new-password">New Password</label>
                <input
                  id="account-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={12}
                />
                <small>{passwordPolicyMessage}</small>
              </div>

              <div className="input-group">
                <label htmlFor="account-confirm-password">Confirm New Password</label>
                <input
                  id="account-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={12}
                />
              </div>

              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Account Changes'}
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4 items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900/80 hover:bg-blue-600/90 border-2 border-white/20 
                       text-white font-bold px-6 py-3 rounded-xl
                       transition-all duration-200 hover:scale-105"
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