import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import Admin from '../models/Admin.js';

dotenv.config();

const registerAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@nhms.edu.pk';
        const existing = await Admin.findOne({ email: adminEmail });

        if (existing) {
            console.log('Admin already exists:', adminEmail);
            process.exit(0);
        }

        const admin = await Admin.create({
            firstName: 'System',
            lastName: 'Administrator',
            email: adminEmail,
            password: 'AdminPassword123!',
            phoneNumber: '0300-0000000',
            role: 'ADMIN',
            accessLevel: 'SUPER_ADMIN',
            isEmailVerified: true,
            active: true
        });

        console.log('Admin registered successfully!');
        console.log('Email:', admin.email);
        console.log('Password: AdminPassword123!');
        process.exit(0);
    } catch (error) {
        console.error('Registration failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

registerAdmin();
