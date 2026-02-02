import mongoose from 'mongoose';
import Request from './Request.js';

const CleaningRequestSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    required: true
  },
  cleaningType: {
    type: String,
    enum: ['ROUTINE', 'DEEP_CLEANING', 'EMERGENCY'],
    default: 'ROUTINE'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CleaningStaff'
  },
  completionDate: Date,
  notes: String
});

const CleaningRequest = Request.discriminator('CLEANING_REQUEST', CleaningRequestSchema);

export default CleaningRequest;
