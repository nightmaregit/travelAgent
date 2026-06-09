import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/authMiddleware.ts';
import pool from '../utils/db.ts';
import { v4 as uuidv4 } from 'uuid';

export const createPayment = async (req: AuthRequest, res: Response) => {
  const { booking_id, payment_method, amount_paid, proof_image } = req.body;
  const user_id = req.user?.id;

  if (!booking_id || !payment_method || !amount_paid) {
    return res.status(400).json({
      status: 'Error',
      message: 'booking_id, payment_method, and amount_paid are required',
      data: null
    });
  }

  try {
    // 1. Verify booking ownership and amount
    const [bookings]: any = await pool.query(
      'SELECT * FROM bookings WHERE id = ?',
      [booking_id]
    );
    const booking = bookings[0];

    if (!booking) {
      return res.status(404).json({
        status: 'Error',
        message: 'Booking not found',
        data: null
      });
    }

    if (booking.user_id !== user_id) {
      return res.status(403).json({
        status: 'Error',
        message: 'Access denied: You do not own this booking',
        data: null
      });
    }

    // Convert to number for comparison (Decimal from DB comes as string)
    if (parseFloat(amount_paid) !== parseFloat(booking.total_amount)) {
      return res.status(400).json({
        status: 'Error',
        message: `Amount paid (${amount_paid}) does not match booking total (${booking.total_amount})`,
        data: null
      });
    }

    const payment_id = uuidv4();

    // 2. Insert payment record
    await pool.query(
      'INSERT INTO payments (id, booking_id, payment_method, amount_paid, status, proof_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [payment_id, booking_id, payment_method, amount_paid, 'unpaid', proof_image || null]
    );

    return res.status(201).json({
      status: 'Success',
      message: 'Payment proof submitted successfully',
      data: {
        id: payment_id,
        booking_id,
        status: 'unpaid'
      }
    });
  } catch (error: any) {
    console.error('Create payment error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  const { id: payment_id } = req.params;
  const { status } = req.body; // 'success' or 'failed'

  if (!['success', 'failed'].includes(status)) {
    return res.status(400).json({
      status: 'Error',
      message: 'Status must be either "success" or "failed"',
      data: null
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Get payment and booking info
    const [payments]: any = await connection.query(
      'SELECT * FROM payments WHERE id = ? FOR UPDATE',
      [payment_id]
    );
    const payment = payments[0];

    if (!payment) {
      await connection.rollback();
      return res.status(404).json({
        status: 'Error',
        message: 'Payment record not found',
        data: null
      });
    }

    // 2. Update payment status
    await connection.query(
      'UPDATE payments SET status = ?, payment_date = ?, updated_at = NOW() WHERE id = ?',
      [status, status === 'success' ? new Date() : null, payment_id]
    );

    // 3. If success, update booking status to confirmed
    if (status === 'success') {
      await connection.query(
        'UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?',
        ['confirmed', payment.booking_id]
      );
    }

    await connection.commit();

    return res.status(200).json({
      status: 'Success',
      message: `Payment verified as ${status}`,
      data: {
        payment_id,
        status,
        booking_id: payment.booking_id
      }
    });
  } catch (error: any) {
    await connection.rollback();
    console.error('Verify payment error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  } finally {
    connection.release();
  }
};
