import express from 'express';
import { loginUser, createUser, updateUserInfo, updateGameState, deleteUser } from '../controllers/userController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Routes for user
router.post('/auth/login', loginUser);
router.post('/register', createUser); // Registration 
router.patch('/auth/info', authenticate, updateUserInfo); // Update personal info
router.patch('/auth/gamestate', authenticate, updateGameState); // Update game state
router.delete('/:id', authenticate, deleteUser);

// Add a protected route for testing
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.userData });
});

export default router;
