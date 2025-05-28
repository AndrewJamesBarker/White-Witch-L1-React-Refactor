// src/components/pages/VerifyEmail.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Token is missing');
        return;
      }

      try {
        const response = await api.get(`/verify-email?token=${token}`);
        setMessage(response.data.message);
        setTimeout(() => navigate('/signin'), 3000); // Redirect to sign-in page after 3 seconds
      } catch (err) {
        setMessage(err.response.data.message || 'Verification failed');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="verification-container">
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
