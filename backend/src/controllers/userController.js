import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserGameState from '../models/User.js';
import sendVerificationEmail from './emailController.js';


// For logging in
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserGameState.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Authentication failed' });
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
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'Strict',
    });

    // Return user data (excluding email)
    res.json({
      user: {
        userId: user._id,
        username: user.username,
        gameState: user.gameState,
        notes: user.notes
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token'); // Clear the authentication cookie
  res.json({ message: 'Logged out successfully' });
};


// For registering
export const createUser = async (req, res) => {
  const { username, email, password, gameState, notes } = req.body;  
  try {
    const newUser = new UserGameState({
      username,
      email,
      password,
      gameState: {  
        ...gameState
      },
      notes  
    });
    // Send verification email
    await sendVerificationEmail(newUser);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// For updating user

// Update user personal information

export const updateUserInfo = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body; // Only accept personal info changes
  try {
    const user = await UserGameState.findById(id);
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

// Update user game state for Save Game
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
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};