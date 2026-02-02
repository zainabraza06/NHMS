import mongoose from 'mongoose';
import Request from './Request.js';

const LeaveRequestSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: [true, 'Please provide start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date']
  },
  reason: {
    type: String,
    required: [true, 'Please provide reason for leave']
  },
  duration: {
    type: Number,
    default: 0
  },
  parentContact: String
});

const LeaveRequest = Request.discriminator('LEAVE_REQUEST', LeaveRequestSchema);

export default LeaveRequest;
