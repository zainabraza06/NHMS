import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import Hostelite from '../models/Hostelite.js';
import Challan from '../models/Challan.js';

dotenv.config();

const updateAndSeed = async () => {
    try {
        await connectDB();

        // 1. Mark existing unpaid challans as OVERDUE if they are past due date
        const now = new Date();
        const overdueResult = await Challan.updateMany(
            { status: 'UNPAID', dueDate: { $lt: now } },
            { $set: { status: 'OVERDUE' } }
        );
        console.log(`Updated ${overdueResult.modifiedCount} challans to OVERDUE.`);

        // 2. Seed some PAID challans for testing
        const hostelite = await Hostelite.findOne({ email: 'hostelite1@nhms.edu.pk' });
        if (hostelite) {
            const paidChallan = await Challan.create({
                hostelite: hostelite._id,
                month: '11-2025',
                baseMessFee: 17400,
                messOffDiscount: 0,
                penalty: 0,
                totalAmount: 17400,
                status: 'PAID',
                dueDate: new Date('2025-11-10'),
                paidAt: new Date('2025-11-05')
            });
            console.log('Created a PAID challan for testing.');
        }

        process.exit(0);
    } catch (error) {
        if (error.code === 11000) {
            console.log('Test PAID challan already exists or duplicate index hit.');
            process.exit(0);
        }
        console.error('Update failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

updateAndSeed();
