import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/authMiddleware.ts';
import pool from '../utils/db.ts';
import { v4 as uuidv4 } from 'uuid';

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { tour_package_id, total_pax } = req.body;
  const user_id = req.user?.id;

  if (!tour_package_id || !total_pax) {
    return res.status(400).json({
      status: 'Error',
      message: 'tour_package_id and total_pax are required',
      data: null
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Check package and quota
    const [packages]: any = await connection.query(
      'SELECT * FROM tour_packages WHERE id = ? FOR UPDATE',
      [tour_package_id]
    );
    const pkg = packages[0];

    if (!pkg) {
      await connection.rollback();
      return res.status(404).json({
        status: 'Error',
        message: 'Tour package not found',
        data: null
      });
    }

    if (!pkg.is_active) {
      await connection.rollback();
      return res.status(400).json({
        status: 'Error',
        message: 'Tour package is not active',
        data: null
      });
    }

    if (pkg.quota < total_pax) {
      await connection.rollback();
      return res.status(400).json({
        status: 'Error',
        message: 'Insufficient quota',
        data: null
      });
    }

    // 2. Calculate total amount
    const total_amount = parseFloat(pkg.price) * total_pax;

    // 3. Generate booking code
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const booking_code = `TRV-${dateStr}-${randomStr}`;

    const booking_id = uuidv4();

    // 4. Insert booking
    await connection.query(
      'INSERT INTO bookings (id, user_id, tour_package_id, booking_code, booking_date, total_pax, total_amount, status, updated_at) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, NOW())',
      [booking_id, user_id, tour_package_id, booking_code, total_pax, total_amount, 'pending']
    );

    // 5. Update quota
    await connection.query(
      'UPDATE tour_packages SET quota = quota - ?, updated_at = NOW() WHERE id = ?',
      [total_pax, tour_package_id]
    );

    await connection.commit();

    return res.status(201).json({
      status: 'Success',
      message: 'Booking created successfully',
      data: {
        id: booking_id,
        booking_code,
        total_amount
      }
    });
  } catch (error: any) {
    await connection.rollback();
    console.error('Booking creation error:', error);
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

export const getBookings = async (req: AuthRequest, res: Response) => {
  const { id, role } = req.user!;

  try {
    let query = 'SELECT b.*, p.title as package_title FROM bookings b JOIN tour_packages p ON b.tour_package_id = p.id';
    const params: any[] = [];

    if (role !== 'admin') {
      query += ' WHERE b.user_id = ?';
      params.push(id);
    }

    query += ' ORDER BY b.created_at DESC';

    const [rows]: any = await pool.query(query, params);

    return res.status(200).json({
      status: 'Success',
      message: 'Bookings retrieved successfully',
      data: rows
    });
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  const { id: booking_id } = req.params;
  const { id: user_id, role } = req.user!;

  try {
    const [rows]: any = await pool.query(
      'SELECT b.*, p.title as package_title, p.destination, p.start_date, p.end_date FROM bookings b JOIN tour_packages p ON b.tour_package_id = p.id WHERE b.id = ?',
      [booking_id]
    );
    const booking = rows[0];

    if (!booking) {
      return res.status(404).json({
        status: 'Error',
        message: 'Booking not found',
        data: null
      });
    }

    // Check ownership
    if (role !== 'admin' && booking.user_id !== user_id) {
      return res.status(403).json({
        status: 'Error',
        message: 'Access denied',
        data: null
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Booking retrieved successfully',
      data: booking
    });
  } catch (error: any) {
    console.error('Fetch booking by id error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  }
};
