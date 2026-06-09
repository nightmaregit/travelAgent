import { Router } from 'express';
import { createBooking, getBookings, getBookingById } from '../controllers/bookingController.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';

const router = Router();

router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getBookings);
router.get('/:id', authenticateToken, getBookingById);

export default router;
