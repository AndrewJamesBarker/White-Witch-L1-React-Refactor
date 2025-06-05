import express from 'express';
import { loginUser, createUser, updateUserInfo, updateGameState, logoutUser, deleteUser, verifyEmailToken, resendVerificationEmail } from '../controllers/userController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Routes for user authentication and registration
router.post('/auth/login', loginUser);
router.post('/register', createUser); // Registration
router.post('/auth/logout', authenticate, logoutUser); // Logout user

// Routes for updating user information and game state
router.patch('/auth/info', authenticate, updateUserInfo); // Update personal info
router.patch('/auth/gamestate', authenticate, updateGameState); // Update game state

// Routes for email verification
router.get('/verify-email', verifyEmailToken); // Email verification
router.post('/resend-verification-email', resendVerificationEmail); // Resend verification email

// Route for deleting user
router.delete('/delete-account', authenticate, deleteUser);

export default router;
