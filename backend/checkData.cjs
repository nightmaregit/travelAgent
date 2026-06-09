const mysql = require('mysql2/promise');

async function checkData() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'rootpassword',
      database: 'travelagent'
    });
    const [packages] = await conn.query('SELECT * FROM tour_packages');
    console.log('Packages:', packages);
    const [users] = await conn.query('SELECT id, full_name, email, role FROM users');
    console.log('Users:', users);
    await conn.end();
  } catch (err) {
    console.error('Check failed:', err);
  }
}

checkData();
