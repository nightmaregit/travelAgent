import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.ts';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'superrahasia123';

export const register = async (req: Request, res: Response) => {
  const { full_name, email, password, phone_number } = req.body;

  // 1. Validasi Input
  if (!full_name || !email || !password) {
    return res.status(400).json({
      status: 'Error',
      message: 'Full name, email, and password are required',
      data: null
    });
  }

  if (password.length < 6 || password.length > 8) {
    return res.status(400).json({
      status: 'Error',
      message: 'Password must be between 6 and 8 characters',
      data: null
    });
  }

  try {
    // 2. Cek apakah email sudah terdaftar
    const [existingUser]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'Email already registered',
        data: null
      });
    }

    // 3. Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // 4. Simpan ke database
    await pool.query(
      'INSERT INTO users (id, full_name, email, password, phone_number, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [userId, full_name, email, hashedPassword, phone_number || null, 'customer']
    );

    res.status(201).json({
      status: 'Success',
      message: 'User registered successfully',
      data: {
        id: userId,
        full_name,
        email,
        role: 'customer'
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'Error',
      message: 'Email and password are required',
      data: null
    });
  }

  try {
    // 1. Cari user berdasarkan email
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        status: 'Error',
        message: 'Invalid email or password',
        data: null
      });
    }

    // 2. Cocokkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'Error',
        message: 'Invalid email or password',
        data: null
      });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      status: 'Success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  }
};
