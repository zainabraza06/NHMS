import express from 'express';
import {
    getGlobalStats,
    getAllComplaintsGlobal,
    getAllRequestsGlobal,
    getAllHostels
} from '../controllers/adminController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorize(['ADMIN']));

router.get('/stats', getGlobalStats);
router.get('/complaints', getAllComplaintsGlobal);
router.get('/requests', getAllRequestsGlobal);
router.get('/hostels', getAllHostels);

export default router;
