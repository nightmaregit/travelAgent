import express from 'express';
import mysql from 'mysql2/promise';
import authRoutes from './src/routes/authRoutes.ts';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);

// Create a robust connection pool using raw mysql2
// This avoids the Prisma 7 adapter timeout issues in this specific Bun environment
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'travelagent',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/health', async (req, res) => {
  try {
    console.log('Attempting to check DB connection with mysql2...');
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release(); // Always release back to pool
    console.log('DB connection successful.');
    
    res.json({ status: 'OK', message: 'Backend and Database (mysql2) are connected' });
  } catch (error) {
    console.error('Database connection error details:', error);
    res.status(500).json({ 
      status: 'Error', 
      message: 'Database connection failed', 
      details: error instanceof Error ? error.message : String(error) 
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
