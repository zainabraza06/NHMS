import Challan from '../models/Challan.js';
import Hostelite from '../models/Hostelite.js';
import MessOffRequest from '../models/MessOffRequest.js';
import Hostel from '../models/Hostel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Logic for mess off discount: 580 PKR per day
const MESS_OFF_DAILY_RATE = 580;

/**
 * Generate challans for all hostelites for a specific month
 * Usually runs at the end of the month or beginning of next
 */
export const generateMonthlyChallans = asyncHandler(async (req, res) => {
    const { month } = req.body; // e.g., "02-2026"

    if (!month) {
        return res.status(400).json({ success: false, message: 'Please provide month in MM-YYYY format' });
    }

    const hostelites = await Hostelite.find().populate('hostel');
    const results = { created: 0, skipped: 0, errors: [] };

    for (const hostelite of hostelites) {
        try {
            // 1. Check if challan already exists
            const existing = await Challan.findOne({ hostelite: hostelite._id, month });
            if (existing) {
                results.skipped++;
                continue;
            }

            // 2. Calculate mess off discount for this month
            const messOffRequests = await MessOffRequest.find({
                hostelite: hostelite._id,
                status: 'APPROVED',
                [`approvedDaysPerMonth.${month}`]: { $exists: true }
            });

            let totalMessOffDays = 0;
            messOffRequests.forEach(req => {
                totalMessOffDays += req.approvedDaysPerMonth.get(month) || 0;
            });

            const messOffDiscount = totalMessOffDays * MESS_OFF_DAILY_RATE;

            // 3. Get base mess charges from hostel
            const baseMessFee = hostelite.hostel?.messCharges || 15000; // Default if not set

            // 4. Calculate penalty (mock logic: check if previous month was paid)
            let penalty = 0;
            // ... potential penalty logic here

            const totalAmount = Math.max(0, baseMessFee - messOffDiscount + penalty);

            // 5. Create Challan
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 10); // Due in 10 days

            const challan = new Challan({
                hostelite: hostelite._id,
                month,
                baseMessFee,
                messOffDiscount,
                penalty,
                totalAmount,
                dueDate,
                status: 'UNPAID'
            });

            await challan.save();
            results.created++;
        } catch (err) {
            results.errors.push({ id: hostelite._id, error: err.message });
        }
    }

    res.json({
        success: true,
        message: `Challan generation complete. Created: ${results.created}, Skipped: ${results.skipped}`,
        data: results
    });
});

/**
 * Get all challans for a hostelite
 */
export const getMyChallans = asyncHandler(async (req, res) => {
    const hosteliteId = req.user.userId;
    const challans = await Challan.find({ hostelite: hosteliteId }).sort({ createdAt: -1 });

    res.json({
        success: true,
        data: challans
    });
});

/**
 * Mocking Stripe Payment Intent creation
 */
export const createPaymentIntent = asyncHandler(async (req, res) => {
    const { challanId } = req.body;
    const challan = await Challan.findById(challanId);

    if (!challan) {
        return res.status(404).json({ success: false, message: 'Challan not found' });
    }

    // Mock Stripe Intent
    const mockIntent = {
        id: `pi_mock_${Date.now()}`,
        client_secret: `secret_mock_${Date.now()}`,
        amount: challan.totalAmount * 100 // Stripe uses cents
    };

    res.json({
        success: true,
        data: mockIntent
    });
});

/**
 * Confirm Payment (Mock)
 */
export const confirmPayment = asyncHandler(async (req, res) => {
    const { challanId, paymentIntentId } = req.body;
    const challan = await Challan.findById(challanId);

    if (!challan) {
        return res.status(404).json({ success: false, message: 'Challan not found' });
    }

    challan.status = 'PAID';
    challan.paidAt = new Date();
    challan.stripePaymentIntentId = paymentIntentId;
    await challan.save();

    res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: challan
    });
});
