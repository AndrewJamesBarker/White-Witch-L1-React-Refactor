import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Hello from the Express app!');
});

// Setup database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

export default app;
