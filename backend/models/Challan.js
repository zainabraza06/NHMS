import mongoose from 'mongoose';

const ChallanSchema = new mongoose.Schema({
    hostelite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostelite',
        required: true
    },
    month: {
        type: String, // e.g., "02-2026"
        required: true
    },
    baseMessFee: {
        type: Number,
        required: true,
        default: 0
    },
    messOffDiscount: {
        type: Number,
        required: true,
        default: 0
    },
    penalty: {
        type: Number,
        required: true,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['UNPAID', 'PAID', 'OVERDUE'],
        default: 'UNPAID'
    },
    dueDate: {
        type: Date,
        required: true
    },
    stripePaymentIntentId: String,
    paidAt: Date
}, { timestamps: true });

// Ensure one challan per month per hostelite
ChallanSchema.index({ hostelite: 1, month: 1 }, { unique: true });

const Challan = mongoose.model('Challan', ChallanSchema);

export default Challan;
