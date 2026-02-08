import express from 'express';
import {
    getGlobalStats,
    getAllComplaintsGlobal,
    getAllRequestsGlobal,
    getAllHostels,
    getAllHostelitesGlobal,
    createHostel,
    createHostelite,
    deleteHostelite,
    getAvailableRooms,
    createHostelManager,
    deleteHostelManager
} from '../controllers/adminController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorize(['ADMIN']));

router.get('/stats', getGlobalStats);
router.get('/complaints', getAllComplaintsGlobal);
router.get('/requests', getAllRequestsGlobal);
router.get('/hostels', getAllHostels);
router.post('/hostels', createHostel);
router.get('/hostels/:id/available-rooms', getAvailableRooms);
router.get('/hostelites', getAllHostelitesGlobal);
router.post('/hostelites', createHostelite);
router.delete('/hostelites/:id', deleteHostelite);
router.post('/managers', createHostelManager);
router.delete('/managers/:id', deleteHostelManager);

export default router;
