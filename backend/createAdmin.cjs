const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'travelagent',
  });

  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const id = 'admin-uuid-1';
    
    // Check if exists
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@travelagent.com']);
    if (rows.length > 0) {
      console.log('Admin already exists.');
      return;
    }

    await pool.query(
      'INSERT INTO users (id, full_name, email, password, role, updated_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [id, 'Administrator', 'admin@travelagent.com', hashedPassword, 'admin']
    );
    console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await pool.end();
  }
}

createAdmin();
