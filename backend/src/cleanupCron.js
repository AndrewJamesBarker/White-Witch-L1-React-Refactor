import cron from 'node-cron';
import UserGameState from './models/User.js';

// Schedule a job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  const expirationDays = 7; // Number of days before an unverified user is considered expired
  const expirationDate = new Date(Date.now() - expirationDays * 24 * 60 * 60 * 1000);

  try {
    const result = await UserGameState.deleteMany({ isVerified: false, registrationDate: { $lt: expirationDate } });
    console.log(`Deleted ${result.deletedCount} unverified users.`);
  } catch (error) {
    console.error('Error deleting unverified users:', error);
  }
});
