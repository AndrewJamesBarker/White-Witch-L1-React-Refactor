import { app, connectDB } from './app.js';
import './cleanupCron.js'; // Import the cleanup job

const port = process.env.PORT || 3001;

// Connect to database and start server
connectDB().then(() => {
  app.listen(port, () => {
    // console.log(`Server running on port ${port}`);
  });
});
