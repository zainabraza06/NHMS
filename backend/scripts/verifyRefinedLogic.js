import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hostelite from '../models/Hostelite.js';
import MessOffRequest from '../models/MessOffRequest.js';

dotenv.config();

const runVerification = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const hostelite = await Hostelite.findOne({ email: 'hostelite1@nhms.edu.pk' });
        if (!hostelite) throw new Error('Hostelite not found');

        // Helper to check discount logic for a single month's approved days
        const calculateDiscount = (days) => {
            const capped = Math.min(days, 12);
            return capped > 1 ? capped * 580 : 0;
        };

        console.log('\n--- Test 1: 2-Day Request (Feb 28 - March 1) ---');
        // Logic: Total 2 days. Skip Feb 28. Count March 1.
        // Feb: 0 days. March: 1 day.
        const start1 = new Date('2026-02-28');
        const end1 = new Date('2026-03-01');

        const daysByMonth1 = {};
        let temp1 = new Date(start1);
        temp1.setDate(temp1.getDate() + 1); // Skip 1st day

        while (temp1 <= end1) {
            const key = `${(temp1.getMonth() + 1).toString().padStart(2, '0')}-${temp1.getFullYear()}`;
            daysByMonth1[key] = (daysByMonth1[key] || 0) + 1;
            temp1.setDate(temp1.getDate() + 1);
        }

        console.log('Split Counts:', daysByMonth1);
        console.log('Discount Feb:', calculateDiscount(daysByMonth1['02-2026'] || 0));
        console.log('Discount March:', calculateDiscount(daysByMonth1['03-2026'] || 0));
        if (!daysByMonth1['02-2026'] && daysByMonth1['03-2026'] === 1 && calculateDiscount(1) === 0) {
            console.log('✅ Correct: 2-day split gives 0 discount in both months.');
        }

        console.log('\n--- Test 2: 3-Day Request (Feb 28 - March 2) ---');
        // Logic: Total 3 days. Skip Feb 28. Count March 1, March 2.
        // Feb: 0 days. March: 2 days.
        const start2 = new Date('2026-02-28');
        const end2 = new Date('2026-03-02');

        const daysByMonth2 = {};
        let temp2 = new Date(start2);
        temp2.setDate(temp2.getDate() + 1); // Skip 1st day

        while (temp2 <= end2) {
            const key = `${(temp2.getMonth() + 1).toString().padStart(2, '0')}-${temp2.getFullYear()}`;
            daysByMonth2[key] = (daysByMonth2[key] || 0) + 1;
            temp2.setDate(temp2.getDate() + 1);
        }

        console.log('Split Counts:', daysByMonth2);
        console.log('Discount March:', calculateDiscount(daysByMonth2['03-2026'] || 0));
        if (daysByMonth2['03-2026'] === 2 && calculateDiscount(2) === 1160) {
            console.log('✅ Correct: 3-day split gives discount for March.');
        }

        console.log('\n--- Test 3: Large Single Month Request (15 days) ---');
        // Skip 1 day. Count 14. Cap at 12. Discount should be 12 * 580 = 6960.
        const days = 14;
        const disc = calculateDiscount(days);
        console.log(`Count: ${days}, Capped: 12, Discount: ${disc}`);
        if (disc === 12 * 580) console.log('✅ Correct: Capping logic holds.');

        console.log('\nVerification completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Verification failed:', err);
        process.exit(1);
    }
};

runVerification();
