import express from 'express';
import { verifyEmail, login, requestPasswordReset, resetPassword, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticateToken, changePassword);

export default router;
