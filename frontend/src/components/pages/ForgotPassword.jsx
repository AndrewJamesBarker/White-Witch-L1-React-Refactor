import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Footer from '../layout/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/forgot-password', {
        email: email.toLowerCase(),
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit password reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex-container">
        <h2 className="blue-text">RESET PASSWORD</h2>
        {message && <p className="standard-text blue-text">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="form-field-width-control">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="forgot-password-email">Email</label>
              <input
                id="forgot-password-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <button className="margin-btm-1" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button type="button" onClick={() => navigate('/signin')}>
              Back to Login
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;