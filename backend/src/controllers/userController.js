import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserGameState from '../models/User.js';
import sendVerificationEmail from './emailController.js';
import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();
const  RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Helper function to verify reCAPTCHA using axios
const verifyRecaptcha = async (recaptchaToken) => {
  const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
  const response = await axios.post(verifyURL);
  return response.data;
};

// For logging in
export const loginUser = async (req, res) => {
  const { email, password, 'g-recaptcha-response': recaptchaToken } = req.body;

  // Verify reCAPTCHA
  if (!recaptchaToken) {
    return res.status(400).json({ message: 'reCAPTCHA token is required' });
  }

  try {
    const recaptchaResponse = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResponse.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }
  
    const user = await UserGameState.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please check your email for the verification link.' });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None', // Use 'None' for cross-site cookies
      // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      // sameSite: 'Strict',
    });

    // Return user data (excluding email)
    res.json({
      user: {
        userId: user._id,
        username: user.username,
        gameState: user.gameState,
        notes: user.notes,
        token 
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logoutUser = (req, res) => {
  // console.log(req.cookies.token)
  // console.log(req.headers.authorization)
  res.clearCookie('token'); // Clear the authentication cookie
  res.json({ message: 'Logged out successfully' });
};

// For registering
export const createUser = async (req, res) => {
  const { username, email, password, gameState, notes, 'g-recaptcha-response': recaptchaToken } = req.body;  
  if (!recaptchaToken) {
    return res.status(400).json({ message: 'reCAPTCHA token is required' });
  }

  try {

    const recaptchaResponse = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResponse.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    const newUser = new UserGameState({
      username,
      email,
      password,
      gameState: {  
        ...gameState
      },
      notes,
      isVerified: false // Add this field to the schema
    });
    
    await newUser.save();
    // Send verification email
    await sendVerificationEmail(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// For updating user personal information
export const updateUserInfo = async (req, res) => {
  const { userId } = req.userData; // Extract userId from the token data
  const { username, email, password } = req.body; // Only accept personal info changes
  try {
    const user = await UserGameState.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      // Ensure password changes are hashed
      user.password = await bcrypt.hash(password, 8);
    }

    await user.save();
    res.json({ message: 'User information updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// For updating user game state
export const updateGameState = async (req, res) => {
  const { userId } = req.userData; // Extract userId from the token data
  const { gameState } = req.body; // Only accept gameState changes

  try {
    const user = await UserGameState.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only the game state
    user.gameState = { ...user.gameState, ...gameState };

    await user.save();
    res.json({ message: 'Game state updated successfully', gameState: user.gameState });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// For deleting user
export const deleteUser = async (req, res) => {
  try {
    const user = await UserGameState.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// For verifying email
export const verifyEmailToken = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserGameState.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true; // Update isVerified field
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// For resending verification email
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserGameState.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    await sendVerificationEmail(user);
    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
