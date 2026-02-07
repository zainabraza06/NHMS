import Challan from '../models/Challan.js';
import Hostelite from '../models/Hostelite.js';
import MessOffRequest from '../models/MessOffRequest.js';
import Hostel from '../models/Hostel.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');

// Logic for mess off discount: 580 PKR per day
const MESS_OFF_DAILY_RATE = 580;

/**
 * Calculates progressive penalty:
 * - Current month (if past due date): 1000
 * - Next calendar month: 2000
 * - Following calendar month: 3000
 * ... and so on (+1000 for every month it stays unpaid)
 */
const calculatePenalty = (challanMonth, dueDate, status) => {
    if (status === 'PAID') return 0;

    const now = new Date();
    const [chMonth, chYear] = challanMonth.split('-').map(Number);
    const challanDate = new Date(chYear, chMonth - 1);

    // Calendar months difference (0 for same month, 1 for next month, etc.)
    const monthsDiff = (now.getFullYear() - challanDate.getFullYear()) * 12 + (now.getMonth() - challanDate.getMonth());

    // Penalty logic: (sum of 1 to n) * 1000 where n is the number of "late periods"
    // Period 1 starts once past due date.
    // Period 2 starts once calendar month rolls over.
    // Period 3 starts next month rollover, etc.

    let penaltyPeriods = monthsDiff;
    if (now.getDate() >= dueDate.getDate() || monthsDiff > 0) {
        penaltyPeriods = monthsDiff + 1;
    } else {
        // If it's the current month and due date hasn't passed, 0 penalty
        return 0;
    }

    if (penaltyPeriods <= 0) return 0;

    // Sum of 1 to n: (n * (n + 1)) / 2
    const sumToN = (penaltyPeriods * (penaltyPeriods + 1)) / 2;
    return sumToN * 1000;
};

/**
 * Core logic to generate challans for all hostelites for a given month
 */
export const generateChallansForMonth = async (month) => {
    const hostelites = await Hostelite.find().populate('hostel');
    const results = { created: 0, skipped: 0, errors: [] };

    for (const hostelite of hostelites) {
        try {
            const existing = await Challan.findOne({ hostelite: hostelite._id, month });
            if (existing) {
                results.skipped++;
                continue;
            }

            const messOffRequests = await MessOffRequest.find({
                hostelite: hostelite._id,
                status: 'APPROVED',
                [`approvedDaysPerMonth.${month}`]: { $exists: true }
            });

            let totalMessOffDays = 0;
            messOffRequests.forEach(req => {
                totalMessOffDays += req.approvedDaysPerMonth.get(month) || 0;
            });

            let cappedMessOffDays = Math.min(totalMessOffDays, 12);
            const messOffDiscount = cappedMessOffDays > 1 ? cappedMessOffDays * MESS_OFF_DAILY_RATE : 0;

            const [mm, yyyy] = month.split('-').map(Number);
            const daysInMonth = new Date(yyyy, mm, 0).getDate();
            const baseMessFee = daysInMonth * MESS_OFF_DAILY_RATE;

            const penalty = 0;
            const totalAmount = Math.max(0, baseMessFee - messOffDiscount + penalty);

            const dueDate = new Date(yyyy, mm - 1, 10);

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
    return results;
};

/**
 * API handler to manually trigger challan generation
 */
export const generateMonthlyChallans = asyncHandler(async (req, res) => {
    const { month } = req.body; // e.g., "02-2026"

    if (!month) {
        return res.status(400).json({ success: false, message: 'Please provide month in MM-YYYY format' });
    }

    const results = await generateChallansForMonth(month);

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Challan.countDocuments({ hostelite: hosteliteId });
    const challans = await Challan.find({ hostelite: hosteliteId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Update penalties dynamically for overdue unpaid challans
    const updatedChallans = await Promise.all(challans.map(async (challan) => {
        if (challan.status !== 'PAID') {
            const newPenalty = calculatePenalty(challan.month, challan.dueDate, challan.status);
            if (newPenalty !== challan.penalty) {
                challan.penalty = newPenalty;
                challan.totalAmount = challan.baseMessFee - challan.messOffDiscount + newPenalty;
                await challan.save();
            }
        }
        return challan;
    }));

    res.json({
        success: true,
        data: updatedChallans,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
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

    // Refresh penalty before creating payment intent to ensure correct amount
    if (challan.status !== 'PAID') {
        const currentPenalty = calculatePenalty(challan.month, challan.dueDate, challan.status);
        if (currentPenalty !== challan.penalty) {
            challan.penalty = currentPenalty;
            challan.totalAmount = challan.baseMessFee - challan.messOffDiscount + currentPenalty;
            await challan.save();
        }
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(challan.totalAmount * 100),
            currency: 'pkr',
            metadata: {
                challanId: challan._id.toString(),
                hosteliteId: req.user.userId
            },
            payment_method_types: ['card'],
        });

        res.json({
            success: true,
            data: {
                id: paymentIntent.id,
                client_secret: paymentIntent.client_secret,
                amount: paymentIntent.amount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
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
