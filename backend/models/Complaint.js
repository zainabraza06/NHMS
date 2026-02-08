import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
    hostelite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HOSTELITE',
        required: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['PLUMBING', 'ELECTRICAL', 'INTERNET', 'CLEANING', 'MESS', 'OTHER'],
        default: 'OTHER'
    },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED'],
        default: 'PENDING'
    },
    managerComments: {
        type: String,
        trim: true
    },
    resolvedAt: {
        type: Date
    }
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', ComplaintSchema);

export default Complaint;
