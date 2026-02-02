import mongoose from 'mongoose';
import Request from './Request.js';

const MessOffRequestSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: String,
  refundAmount: Number,
  mealCount: Number
});

const MessOffRequest = Request.discriminator('MESS_OFF_REQUEST', MessOffRequestSchema);

export default MessOffRequest;
