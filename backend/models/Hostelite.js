import mongoose from 'mongoose';
import User from './User.js';

const HosteliteSchema = new mongoose.Schema({
  universityId: {
    type: String,
    required: [true, 'Please provide university ID'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please provide department'],
    trim: true
  },
  academicYear: {
    type: Number,
    required: [true, 'Please provide academic year'],
    min: 1,
    max: 4
  },
  roomNumber: {
    type: String,
    required: [true, 'Please provide room number'],
    trim: true
  },
  admissionDate: {
    type: Date,
    required: [true, 'Please provide admission date']
  },
  validUpto: {
    type: Date,
    required: [true, 'Please provide valid upto date']
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: [true, 'Hostelite must be assigned to a hostel']
  },
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    }
  ]
});

const Hostelite = User.discriminator('HOSTELITE', HosteliteSchema);

export default Hostelite;
