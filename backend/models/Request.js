import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      enum: ['LEAVE_REQUEST', 'CLEANING_REQUEST', 'MESS_OFF_REQUEST'],
      required: true
    },
    hostelite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostelite',
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING'
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { discriminatorKey: 'requestType' }
);

const Request = mongoose.model('Request', RequestSchema);

export default Request;
