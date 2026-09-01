import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import UserGameState from '../models/User.js';
import sendVerificationEmail, { sendPasswordResetEmail } from './emailController.js';
import dotenv from 'dotenv';
import { passwordPolicyMessage, validatePasswordPolicy, verifyRecaptcha } from '../utils/authSecurity.js';


dotenv.config();
const PASSWORD_RESET_EXPIRY_MS = 1000 * 60 * 60;
const PASSWORD_RESET_GENERIC_MESSAGE = 'If an account exists for that email, a password reset link has been sent.';

const buildSafeUserPayload = (user) => ({
  userId: user._id,
  username: user.username,
  email: user.email,
  pendingEmail: user.pendingEmail,
  isVerified: user.isVerified,
  gameState: user.gameState,
  notes: user.notes,
});

const buildPasswordResetTokenHash = (token) =>
  createHash('sha256').update(token).digest('hex');

const generateCsrfToken = () => randomBytes(32).toString('hex');

const buildAuthTokenPayload = (user, csrfToken) => ({
  userId: user._id,
  email: user.email,
  csrfToken,
});

const setAuthCookie = (res, user, csrfToken) => {
  const token = jwt.sign(
    buildAuthTokenPayload(user, csrfToken),
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const cookieName = process.env.NODE_ENV === 'production' ? 'token' : 'token_dev';
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
  });
};

// Issues the auth cookie/token and sends the login response for a given user
const issueLoginResponse = (res, user) => {
  const csrfToken = generateCsrfToken();
  setAuthCookie(res, user, csrfToken);

  res.json({
    user: buildSafeUserPayload(user),
    csrfToken,
  });
};

// Finds (or lazily creates) the fixed local dev/test account, pre-verified so it skips email verification
const getOrCreateDevTestUser = async () => {
  const email = process.env.DEV_TEST_EMAIL;
  const password = process.env.DEV_TEST_PASSWORD || 'Devpassword123!';

  let user = await UserGameState.findOne({ email });
  if (!user) {
    user = new UserGameState({
      username: process.env.DEV_TEST_USERNAME || 'devtester',
      email,
      password,
      isVerified: true,
    });
    await user.save();
  }

  return user;
};

// For logging in
export const loginUser = async (req, res) => {
  const { email, password, 'g-recaptcha-response': recaptchaToken } = req.body;

  // Dev-only shortcut: bypasses reCAPTCHA/verification for a fixed local test account, never active in production
  const isDevTestLogin =
    process.env.NODE_ENV !== 'production' &&
    process.env.DEV_TEST_EMAIL &&
    email === process.env.DEV_TEST_EMAIL;

  if (isDevTestLogin) {
    try {
      const devUser = await getOrCreateDevTestUser();
      const isPasswordMatch = await bcrypt.compare(password, devUser.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      return issueLoginResponse(res, devUser);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Verify reCAPTCHA
  if (!recaptchaToken) {
    return res.status(400).json({ message: 'reCAPTCHA token is required' });
  }

  try {
    const recaptchaResult = await verifyRecaptcha({
      token: recaptchaToken,
      expectedAction: 'login',
    });

    if (!recaptchaResult.ok) {
      return res.status(400).json({ message: recaptchaResult.message });
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

    issueLoginResponse(res, user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logoutUser = (req, res) => {
  // Clear the environment-specific cookie
  const cookieName = process.env.NODE_ENV === 'production' ? 'token' : 'token_dev';
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict'
  });
  res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await UserGameState.findById(req.userData.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const csrfToken = req.userData.csrfToken || generateCsrfToken();
    const shouldRefreshSession = !req.userData.csrfToken || req.userData.email !== user.email;

    if (shouldRefreshSession) {
      setAuthCookie(res, user, csrfToken);
    }

    res.json({
      user: buildSafeUserPayload(user),
      csrfToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// For registering
export const createUser = async (req, res) => {
  const { username, email, password, gameState, notes, 'g-recaptcha-response': recaptchaToken } = req.body;  
  if (!recaptchaToken) {
    return res.status(400).json({ message: 'reCAPTCHA token is required' });
  }

  const passwordPolicyError = validatePasswordPolicy(password);
  if (passwordPolicyError) {
    return res.status(400).json({ message: passwordPolicyError });
  }

  try {

    const recaptchaResult = await verifyRecaptcha({
      token: recaptchaToken,
      expectedAction: 'register',
    });

    if (!recaptchaResult.ok) {
      return res.status(400).json({ message: recaptchaResult.message });
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
    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      user: buildSafeUserPayload(newUser),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// For updating user personal information
export const updateUserInfo = async (req, res) => {
  const { userId } = req.userData; // Extract userId from the token data
  const { username, email, password, currentPassword } = req.body; // Only accept personal info changes
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const normalizedUsername = typeof username === 'string' ? username.trim() : '';
  const isPasswordChangeRequested = Boolean(password);
  const isEmailChangeRequested = Boolean(normalizedEmail);

  if (password) {
    const passwordPolicyError = validatePasswordPolicy(password);
    if (passwordPolicyError) {
      return res.status(400).json({ message: passwordPolicyError });
    }
  }

  try {
    const user = await UserGameState.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requiresCurrentPassword = isPasswordChangeRequested || isEmailChangeRequested;
    if (requiresCurrentPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change your email or password.' });
      }

      const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
    }

    if (normalizedUsername && normalizedUsername !== user.username) {
      user.username = normalizedUsername;
    }

    let verificationEmailSent = false;
    if (normalizedEmail && normalizedEmail !== user.email) {
      const existingUser = await UserGameState.findOne({
        _id: { $ne: userId },
        $or: [
          { email: normalizedEmail },
          { pendingEmail: normalizedEmail },
        ],
      });

      if (existingUser) {
        return res.status(400).json({ message: 'That email address is already in use.' });
      }

      user.pendingEmail = normalizedEmail;
      verificationEmailSent = true;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    if (verificationEmailSent) {
      await sendVerificationEmail(user, {
        email: user.pendingEmail,
        purpose: 'email-change',
      });
    }

    const successMessage = verificationEmailSent
      ? 'Your profile was updated. Verify the link sent to your new email address before the login email changes.'
      : 'User information updated successfully';

    res.json({
      message: successMessage,
      user: buildSafeUserPayload(user),
    });
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
    const { userId } = req.userData; // Use the authenticated user's ID from token
    
    const user = await UserGameState.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete the user using modern Mongoose method
    await UserGameState.findByIdAndDelete(userId);
    
    // Clear any authentication cookies
    const cookieName = process.env.NODE_ENV === 'production' ? 'token' : 'token_dev';
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict'
    });
    
    res.json({ message: 'Account permanently deleted' });
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
    const user = decoded.userId
      ? await UserGameState.findById(decoded.userId)
      : await UserGameState.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (decoded.purpose === 'email-change') {
      if (!user.pendingEmail) {
        if (user.email === decoded.email) {
          return res.status(200).json({
            message: 'Email already verified. Your login email has been updated.',
          });
        }

        return res.status(400).json({ message: 'Invalid token' });
      }

      if (user.pendingEmail !== decoded.email) {
        return res.status(400).json({ message: 'Invalid token' });
      }

      const conflictingUser = await UserGameState.findOne({
        _id: { $ne: user._id },
        email: decoded.email,
      });

      if (conflictingUser) {
        return res.status(400).json({ message: 'That email address is already in use.' });
      }

      user.email = decoded.email;
      user.pendingEmail = null;
      user.isVerified = true;
      await user.save();

      return res.status(200).json({
        message: 'Email verified successfully. Your login email has been updated.',
      });
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
  const normalizedEmail = typeof req.body.email === 'string'
    ? req.body.email.trim().toLowerCase()
    : '';

  if (!normalizedEmail) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await UserGameState.findOne({
      $or: [
        { email: normalizedEmail },
        { pendingEmail: normalizedEmail },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.pendingEmail === normalizedEmail) {
      await sendVerificationEmail(user, {
        email: user.pendingEmail,
        purpose: 'email-change',
      });
      return res.status(200).json({ message: 'Verification email sent successfully' });
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

export const requestPasswordReset = async (req, res) => {
  const { email, 'g-recaptcha-response': recaptchaToken } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!recaptchaToken) {
    return res.status(400).json({ message: 'reCAPTCHA token is required' });
  }

  try {
    const recaptchaResult = await verifyRecaptcha({
      token: recaptchaToken,
      expectedAction: 'forgot_password',
    });

    if (!recaptchaResult.ok) {
      return res.status(400).json({ message: recaptchaResult.message });
    }

    const user = await UserGameState.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: PASSWORD_RESET_GENERIC_MESSAGE });
    }

    const passwordResetToken = randomBytes(32).toString('hex');
    user.passwordResetTokenHash = buildPasswordResetTokenHash(passwordResetToken);
    user.passwordResetExpiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MS);
    await user.save();

    await sendPasswordResetEmail(user, passwordResetToken);

    res.status(200).json({ message: PASSWORD_RESET_GENERIC_MESSAGE });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }

  const passwordPolicyError = validatePasswordPolicy(password);
  if (passwordPolicyError) {
    return res.status(400).json({ message: passwordPolicyError });
  }

  try {
    const user = await UserGameState.findOne({
      passwordResetTokenHash: buildPasswordResetTokenHash(token),
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now sign in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
