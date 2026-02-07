import express from 'express';
import {
    generateMonthlyChallans,
    getMyChallans,
    createPaymentIntent,
    confirmPayment
} from '../controllers/billingController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes protected by JWT
router.use(authenticateToken);

// Hostelite routes
router.get('/my-challans', authorize('HOSTELITE'), getMyChallans);
router.post('/pay', authorize('HOSTELITE'), createPaymentIntent);
router.post('/confirm', authorize('HOSTELITE'), confirmPayment);

// Manager routes
router.post('/generate-monthly', authorize('HOSTEL_MANAGER'), generateMonthlyChallans);

export default router;
