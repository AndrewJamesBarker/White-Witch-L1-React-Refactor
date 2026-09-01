import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (user, options = {}) => {
  const verificationEmail = options.email || user.email;
  const purpose = options.purpose || 'signup';
  const token = jwt.sign(
    {
      userId: user._id,
      email: verificationEmail,
      purpose,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const isEmailChange = purpose === 'email-change';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: verificationEmail,
    subject: isEmailChange
      ? 'White Witch Email Change Verification'
      : 'White Witch Email Verification',
    text: isEmailChange
      ? `Confirm your new White Witch email address by clicking the following link: ${verificationUrl}`
      : `Please verify your email by clicking the following link: ${verificationUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

export const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'White Witch Password Reset',
    text: `Reset your White Witch password by visiting the following link: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
