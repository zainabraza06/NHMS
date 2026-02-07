import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import Hostelite from '../models/Hostelite.js';
import Challan from '../models/Challan.js';

dotenv.config();

const seedChallans = async () => {
    try {
        await connectDB();

        // Find the first hostelite to seed for
        const hostelite = await Hostelite.findOne({ email: 'hostelite1@nhms.edu.pk' });

        if (!hostelite) {
            console.error('Hostelite not found. Please run seedUsers.js first.');
            process.exit(1);
        }

        // Clear existing challans for this hostelite to have a clean state
        await Challan.deleteMany({ hostelite: hostelite._id });

        const challansData = [
            {
                hostelite: hostelite._id,
                month: '12-2025',
                baseMessFee: 15000,
                messOffDiscount: 1160, // 2 days
                penalty: 0,
                totalAmount: 13840,
                status: 'PAID',
                dueDate: new Date('2025-12-10'),
                paidAt: new Date('2025-12-08'),
                stripePaymentIntentId: 'pi_mock_123456789'
            },
            {
                hostelite: hostelite._id,
                month: '01-2026',
                baseMessFee: 15000,
                messOffDiscount: 0,
                penalty: 0,
                totalAmount: 15000,
                status: 'UNPAID',
                dueDate: new Date('2026-01-10')
            },
            {
                hostelite: hostelite._id,
                month: '02-2026',
                baseMessFee: 15000,
                messOffDiscount: 580, // 1 day
                penalty: 1000, // Penalty because 01-2026 is UNPAID
                totalAmount: 15420,
                status: 'UNPAID',
                dueDate: new Date('2026-02-17')
            }
        ];

        await Challan.insertMany(challansData);

        console.log('Challans seeded successfully for hostelite1@nhms.edu.pk');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

seedChallans();
