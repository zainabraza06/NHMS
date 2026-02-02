import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import {
  getCleaningStaffDashboard,
  getAssignedRequests,
  updateRequestStatus,
  getCleaningStaffProfile,
  updateCleaningStaffProfile
} from '../controllers/cleaningStaffController.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, authorize(['CLEANING_STAFF']), getCleaningStaffDashboard);
router.get('/profile', authenticateToken, authorize(['CLEANING_STAFF']), getCleaningStaffProfile);
router.put('/profile', authenticateToken, authorize(['CLEANING_STAFF']), updateCleaningStaffProfile);
router.get('/requests', authenticateToken, authorize(['CLEANING_STAFF']), getAssignedRequests);
router.put('/requests/:requestId', authenticateToken, authorize(['CLEANING_STAFF']), updateRequestStatus);

export default router;
