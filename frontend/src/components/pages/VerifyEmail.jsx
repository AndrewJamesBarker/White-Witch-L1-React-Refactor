// src/components/pages/VerifyEmail.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const hasVerifiedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasVerifiedRef.current) {
      return undefined;
    }

    hasVerifiedRef.current = true;
    let redirectTimeoutId;

    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Token is missing');
        return;
      }

      try {
        const response = await api.get(`/verify-email?token=${token}`);
        setMessage(response.data.message);
        redirectTimeoutId = window.setTimeout(() => navigate('/signin'), 3000);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };

    verifyToken();

    return () => {
      if (redirectTimeoutId) {
        window.clearTimeout(redirectTimeoutId);
      }
    };
  }, [searchParams, navigate]);

  return (
    <div className="verification-container">
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
