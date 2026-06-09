import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('Connecting to DB at:', process.env.DB_HOST || 'localhost');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '10.89.1.2',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'travelagent',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
