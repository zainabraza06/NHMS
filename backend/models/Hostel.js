import mongoose from 'mongoose';

const HostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide hostel name'],
      trim: true,
      unique: true
    },
    hostelCode: {
      type: String,
      required: [true, 'Please provide hostel code'],
      unique: true,
      trim: true
    },
    location: {
      type: String,
      required: true
    },
    totalRooms: {
      type: Number,
      required: true
    },
    totalFloors: {
      type: Number,
      required: true
    },
    occupiedRooms: {
      type: Number,
      default: 0
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HOSTEL_MANAGER'
    },
    hostelites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HOSTELITE'
      }
    ],
    cleaningStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CleaningStaff'
      }
    ],
    messStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'CLOSED'],
      default: 'ACTIVE'
    },
    messCharges: {
      type: Number,
      default: 0
    },
    description: String,
    facilities: [String]
  },
  { timestamps: true }
);

const Hostel = mongoose.model('Hostel', HostelSchema);

export default Hostel;
