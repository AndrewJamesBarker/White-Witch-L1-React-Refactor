import express from 'express';
import { loginUser, createUser, updateUserInfo, updateGameState, logoutUser, deleteUser, verifyEmailToken, resendVerificationEmail, getCurrentUser, requestPasswordReset, resetPassword } from '../controllers/userController.js';
import authenticate from '../middleware/authenticate.js';
import { authRateLimiters } from '../middleware/rateLimit.js';

const router = express.Router();

// Routes for user authentication and registration
router.post('/auth/login', authRateLimiters.login, loginUser);
router.get('/auth/me', authenticate, getCurrentUser);
router.post('/auth/forgot-password', authRateLimiters.forgotPassword, requestPasswordReset);
router.post('/auth/reset-password', authRateLimiters.resetPassword, resetPassword);
router.post('/register', authRateLimiters.register, createUser); // Registration
router.post('/auth/logout', authenticate, logoutUser); // Logout user

// Routes for updating user information and game state
router.patch('/auth/info', authenticate, updateUserInfo); // Update personal info
router.patch('/auth/gamestate', authenticate, updateGameState); // Update game state

// Routes for email verification
router.get('/verify-email', verifyEmailToken); // Email verification
router.post('/resend-verification-email', authRateLimiters.resendVerification, resendVerificationEmail); // Resend verification email

// Route for deleting user
router.delete('/delete-account', authenticate, deleteUser);

export default router;
