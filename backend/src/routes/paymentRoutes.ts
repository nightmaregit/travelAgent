import { Router } from 'express';
import { createPayment, verifyPayment } from '../controllers/paymentController.ts';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.ts';

const router = Router();

router.post('/', authenticateToken, createPayment);
router.put('/:id/verify', authenticateToken, isAdmin, verifyPayment);

export default router;
