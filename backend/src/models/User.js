import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gameState: {
    currentChapter: {
      level: { type: Number, default: 1 },
      completed: { type: Boolean, default: false }
    },
    items: [{ type: String }],
    livesLeft: { type: Number, default: 3 },
    chaptersCompleted: {
      chapterOne: { type: Boolean, default: false },
      chapterTwo: { type: Boolean, default: false },
      chapterThree: { type: Boolean, default: false },
      chapterFour: { type: Boolean, default: false },
      chapterFive: { type: Boolean, default: false },
      chapterSix: { type: Boolean, default: false },
      chapterSeven: { type: Boolean, default: false },
      chapterEight: { type: Boolean, default: false },
    },
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
