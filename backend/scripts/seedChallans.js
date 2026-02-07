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
                baseMessFee: 17980, // 31 * 580
                messOffDiscount: 0,
                penalty: 6000,
                totalAmount: 23980,
                status: 'UNPAID',
                dueDate: new Date('2025-12-10')
            },
            {
                hostelite: hostelite._id,
                month: '01-2026',
                baseMessFee: 17980, // 31 * 580
                messOffDiscount: 0,
                penalty: 3000,
                totalAmount: 20980,
                status: 'UNPAID',
                dueDate: new Date('2026-01-10')
            },
            {
                hostelite: hostelite._id,
                month: '02-2026',
                baseMessFee: 16240, // 28 * 580
                messOffDiscount: 0,
                penalty: 0,
                totalAmount: 16240,
                status: 'UNPAID',
                dueDate: new Date('2026-02-10')
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
