import express from 'express';
import { loginUser, createUser, updateUserInfo, updateGameState, logoutUser, deleteUser } from '../controllers/userController.js';
import authenticate from '../middleware/authenticate.js';
import jwt from 'jsonwebtoken';
import UserGameState from '../models/User.js';

const router = express.Router();

// Routes for user
router.post('/auth/login', loginUser);
router.post('/register', createUser); // Registration 
router.patch('/auth/info', authenticate, updateUserInfo); // Update personal info
// router.get('/verify-email', verifyEmailToken); // Email verification
// router.post('/resend-verification-email', resendVerificationEmail); // Resend verification email
router.patch('/auth/gamestate', authenticate, updateGameState); // Update game state
router.post('/auth/logout', authenticate, logoutUser); // Logout user
router.delete('/:id', authenticate, deleteUser);

// Email verification routes
router.get('/verify-email', async (req, res) => {
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

    user.isVerified = true; // Assuming you have an isVerified field
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

export default router;
