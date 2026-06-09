import express from 'express';
import packageRoutes from './src/routes/packageRoutes.ts';
import authRoutes from './src/routes/authRoutes.ts';
import bookingRoutes from './src/routes/bookingRoutes.ts';
import paymentRoutes from './src/routes/paymentRoutes.ts';
import pool from './src/utils/db.ts';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.get('/api/health', async (req, res) => {
  try {
    console.log('Attempting to check DB connection with mysql2...');
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release(); // Always release back to pool
    console.log('DB connection successful.');
    
    res.json({ status: 'OK', message: 'Backend and Database (mysql2) are connected' });
  } catch (error: any) {
    console.error('Database connection error details:', error);
    res.status(500).json({ 
      status: 'Error', 
      message: 'Database connection failed', 
      details: error.message || String(error),
      stack: error.stack
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
