import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'userpassword',
  database: process.env.DB_NAME || 'travelagent',
};

app.get('/api/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    await connection.end();
    res.json({ status: 'OK', message: 'Backend and Database are connected' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'Error', message: 'Database connection failed' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
