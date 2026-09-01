import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import Footer from '../layout/Footer';
import {
  isPasswordPolicyValid,
  passwordPolicyMessage,
} from '../utilities/passwordPolicy';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Reset token is missing.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isPasswordPolicyValid(password)) {
      setError(passwordPolicyMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password,
      });
      setMessage(response.data.message);
      window.setTimeout(() => navigate('/signin'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex-container">
        <h2 className="blue-text">SET A NEW PASSWORD</h2>
        {message && <p className="standard-text blue-text">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="form-field-width-control">
          {!token ? (
            <>
              <p className="standard-text">This reset link is invalid or incomplete.</p>
              <button type="button" onClick={() => navigate('/forgot-password')}>
                Request a New Link
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="reset-password">New Password</label>
                <input
                  id="reset-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={12}
                  required
                />
                <small>{passwordPolicyMessage}</small>
              </div>
              <div className="input-group">
                <label htmlFor="reset-password-confirm">Confirm New Password</label>
                <input
                  id="reset-password-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
              <button className="margin-btm-1" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
              <button type="button" onClick={() => navigate('/signin')}>
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;