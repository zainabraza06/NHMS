import express from 'express';
import {
    submitComplaint,
    getMyComplaints,
    getManagerComplaints,
    updateComplaintStatus
} from '../controllers/complaintController.js';
import {  authenticateToken,authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', authorize('HOSTELITE'), submitComplaint);
router.get('/my', authorize('HOSTELITE'), getMyComplaints);
router.get('/all', authorize('HOSTEL_MANAGER'), getManagerComplaints);
router.patch('/:id/resolve', authorize('HOSTEL_MANAGER'), updateComplaintStatus);

export default router;
