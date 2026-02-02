import mongoose from 'mongoose';
import User from './User.js';

const HostelManagerSchema = new mongoose.Schema({
  managerId: {
    type: String,
    required: [true, 'Please provide manager ID'],
    unique: true,
    trim: true
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: [true, 'Manager must be assigned to a hostel']
  },
  joinDate: Date,
  department: String
});

const HostelManager = User.discriminator('HOSTEL_MANAGER', HostelManagerSchema);

export default HostelManager;
