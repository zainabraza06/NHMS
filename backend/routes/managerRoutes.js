import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import {
  getManagerDashboard,
  getManagerRequests,
  approveRequest,
  rejectRequest,
  getManagerHostelites,
  getManagerStaff,
  getManagerProfile,
  updateManagerProfile
} from '../controllers/managerController.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, authorize(['HOSTEL_MANAGER']), getManagerDashboard);
router.get('/profile', authenticateToken, authorize(['HOSTEL_MANAGER']), getManagerProfile);
router.put('/profile', authenticateToken, authorize(['HOSTEL_MANAGER']), updateManagerProfile);
router.get('/requests', authenticateToken, authorize(['HOSTEL_MANAGER']), getManagerRequests);
router.put('/requests/:requestId/approve', authenticateToken, authorize(['HOSTEL_MANAGER']), approveRequest);
router.put('/requests/:requestId/reject', authenticateToken, authorize(['HOSTEL_MANAGER']), rejectRequest);
router.get('/hostelites', authenticateToken, authorize(['HOSTEL_MANAGER']), getManagerHostelites);
router.get('/staff', authenticateToken, authorize(['HOSTEL_MANAGER']), getManagerStaff);

export default router;
