import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserGameState from '../models/User.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (user) => {
  
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const verificationUrl = `${process.env.FRONTEND_URL}verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

export default sendVerificationEmail;
