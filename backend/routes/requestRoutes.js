import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import {
  submitLeaveRequest,
  submitCleaningRequest,
  submitMessOffRequest,
  getMyRequests,
  cancelRequest,
  getRequestStats
} from '../controllers/requestController.js';

const router = express.Router();

router.post('/leave', authenticateToken, authorize(['HOSTELITE']), submitLeaveRequest);
router.post('/cleaning', authenticateToken, authorize(['HOSTELITE']), submitCleaningRequest);
router.post('/mess-off', authenticateToken, authorize(['HOSTELITE']), submitMessOffRequest);
router.get('/my-requests', authenticateToken, authorize(['HOSTELITE']), getMyRequests);
router.get('/stats', authenticateToken, authorize(['HOSTELITE']), getRequestStats);
router.put('/:requestId/cancel', authenticateToken, authorize(['HOSTELITE']), cancelRequest);

export default router;
