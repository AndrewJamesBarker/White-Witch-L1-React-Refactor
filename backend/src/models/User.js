import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gameState: {
    level: { type: Number, default: 0 },
    items: [{ type: String }],
    livesLeft: { type: Number, default: 3 }
  },
  notes: [{ type: String }]
});

// Password hashing middleware before saving a new user
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Create a model from the schema
const UserGameState = mongoose.model('UserGameState', userSchema, 'userGameStates');

export default UserGameState;
