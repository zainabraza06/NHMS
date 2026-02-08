import mongoose from 'mongoose';
import User from './User.js';

const AdminSchema = new mongoose.Schema({
    // Admins might have specific permissions or logs later
    accessLevel: {
        type: String,
        enum: ['SUPER_ADMIN', 'MODERATOR'],
        default: 'SUPER_ADMIN'
    }
});

const Admin = User.discriminator('ADMIN', AdminSchema);

export default Admin;
