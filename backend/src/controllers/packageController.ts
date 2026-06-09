import type { Request, Response } from 'express';
import pool from '../utils/db.ts';
import { v4 as uuidv4 } from 'uuid';

export const getPackages = async (req: Request, res: Response) => {
  const { destination } = req.query;
  let queryStr = 'SELECT * FROM tour_packages WHERE is_active = true';
  const queryParams: any[] = [];

  if (destination) {
    queryStr += ' AND destination LIKE ?';
    queryParams.push('%' + destination + '%');
  }

  try {
    const [rows]: any = await pool.query(queryStr, queryParams);
    return res.status(200).json({
      status: 'Success',
      message: 'Packages retrieved successfully',
      data: rows
    });
  } catch (error: any) {
    console.error('Error fetching packages:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  }
};

export const getPackageById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows]: any = await pool.query('SELECT * FROM tour_packages WHERE id = ?', [id]);
    const pkg = rows[0];

    if (!pkg) {
      return res.status(404).json({
        status: 'Error',
        message: 'Package not found',
        data: null
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Package retrieved successfully',
      data: pkg
    });
  } catch (error: any) {
    console.error('Error fetching package:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  }
};

export const createPackage = async (req: Request, res: Response) => {
  const { title, destination, description, price, quota, start_date, end_date } = req.body;

  if (!title || !destination || !price || !quota || !start_date || !end_date) {
    return res.status(400).json({
      status: 'Error',
      message: 'Missing required fields',
      data: null
    });
  }

  try {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO tour_packages (id, title, destination, description, price, quota, start_date, end_date, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [id, title, destination, description || '', price, quota, start_date, end_date]
    );

    return res.status(201).json({
      status: 'Success',
      message: 'Package created successfully',
      data: { id, title, destination }
    });
  } catch (error: any) {
    console.error('Error creating package:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, destination, description, price, quota, start_date, end_date, is_active } = req.body;

  try {
    // Check if exists
    const [existing]: any = await pool.query('SELECT id FROM tour_packages WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Package not found',
        data: null
      });
    }

    await pool.query(
      'UPDATE tour_packages SET title = ?, destination = ?, description = ?, price = ?, quota = ?, start_date = ?, end_date = ?, is_active = ?, updated_at = NOW() WHERE id = ?',
      [title, destination, description, price, quota, start_date, end_date, is_active ?? true, id]
    );

    return res.status(200).json({
      status: 'Success',
      message: 'Package updated successfully',
      data: { id }
    });
  } catch (error: any) {
    console.error('Error updating package:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Soft delete / set is_active = false as per issue.md
    const [result]: any = await pool.query('UPDATE tour_packages SET is_active = false, updated_at = NOW() WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Package not found',
        data: null
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Package deactivated successfully',
      data: null
    });
  } catch (error: any) {
    console.error('Error deleting package:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      data: null,
      details: error.message
    });
  }
};
