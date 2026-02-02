import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import {
  getHosteliteDashboard,
  getHosteliteRequests,
  getHosteliteProfile,
  updateHosteliteProfile,
  getAllHostelites
} from '../controllers/hosteliteController.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, authorize(['HOSTELITE']), getHosteliteDashboard);
router.get('/profile', authenticateToken, authorize(['HOSTELITE']), getHosteliteProfile);
router.put('/profile', authenticateToken, authorize(['HOSTELITE']), updateHosteliteProfile);
router.get('/requests', authenticateToken, authorize(['HOSTELITE']), getHosteliteRequests);
router.get('/all', authenticateToken, authorize(['HOSTEL_MANAGER']), getAllHostelites);

export default router;
