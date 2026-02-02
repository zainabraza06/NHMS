import mongoose from 'mongoose';
import User from './User.js';

const CleaningStaffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: [true, 'Please provide staff ID'],
    unique: true,
    trim: true
  },
  assignedHostels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel'
    }
  ],
  assignedFloors: [String],
  cleaningRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CleaningRequest'
    }
  ],
  salary: Number,
  joinDate: Date,
  shiftTiming: {
    type: String,
    enum: ['MORNING', 'AFTERNOON', 'NIGHT'],
    default: 'MORNING'
  }
});

const CleaningStaff = User.discriminator('CLEANING_STAFF', CleaningStaffSchema);

export default CleaningStaff;
