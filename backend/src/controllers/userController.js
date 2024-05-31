import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserGameState from '../models/User.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserGameState.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    // Generate a token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Secret key for encoding
      { expiresIn: '1h' }     // Token expires in 1 hour
    );
    
    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
  const { id } = req.params;
  const { gameState } = req.body; // Only accept gameState changes
  try {
    const user = await UserGameState.findById(id);
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