import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js'; // Adjust the path as necessary

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());
app.use(bodyParser.json());

// Setup CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Allow only this origin to connect
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
  credentials: true // Allow cookies
}));

// Define routes
// Mount the user routes at '/api/users'
app.use('/api/users', userRoutes);

// Setup database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Optionally, you can handle this more gracefully
  }
};

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Export app and connectDB for use in the server file
export { app, connectDB };
