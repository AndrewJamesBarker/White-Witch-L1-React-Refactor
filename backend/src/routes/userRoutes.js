import express from 'express';
import { getUser, createUser, updateUserInfo, updateGameState } from '../controllers/userController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Routes for user
router.get('/', authenticate, getUser);
router.post('/', createUser); // Registration 
router.patch('/info', authenticate, updateUserInfo); // Update personal info
router.patch('/gamestate', authenticate, updateGameState); // Update game state


export default router;
