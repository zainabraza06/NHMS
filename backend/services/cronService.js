import cron from 'node-cron';
import { generateChallansForMonth } from '../controllers/billingController.js';

/**
 * Initialize cron jobs
 */
export const initCronJobs = () => {
    // Schedule: Runs at 00:00 on the 1st day of every month
    // This generates challans for the month that just ended
    cron.schedule('0 0 1 * *', async () => {
        console.log('Running monthly challan generation cron job...');

        try {
            // Calculate previous month
            const now = new Date();
            // Go back 1 day from the 1st to get a date in the previous month
            const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

            const month = (prevMonthDate.getMonth() + 1).toString().padStart(2, '0');
            const year = prevMonthDate.getFullYear();
            const monthStr = `${month}-${year}`;

            console.log(`Generating challans for month: ${monthStr}`);
            const results = await generateChallansForMonth(monthStr);
            console.log(`Cron job completed. Created: ${results.created}, Skipped: ${results.skipped}`);
        } catch (error) {
            console.error('Error in monthly challan generation cron job:', error.message);
        }
    });

    console.log('Cron jobs initialized successfully');
};
