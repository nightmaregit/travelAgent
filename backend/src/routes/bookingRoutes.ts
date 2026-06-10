import { Router } from 'express';
import { createBooking, getBookings, getBookingById, updateBookingStatus } from '../controllers/bookingController.ts';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.ts';

const router = Router();

router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getBookings);
router.get('/:id', authenticateToken, getBookingById);
router.put('/:id/status', authenticateToken, isAdmin, updateBookingStatus);

export default router;
