const mysql = require('mysql2/promise');

async function checkTables() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'rootpassword',
      database: 'travelagent'
    });
    const [rows] = await conn.query('SHOW TABLES');
    console.log('Tables:', rows);
    await conn.end();
  } catch (err) {
    console.error('Check failed:', err);
  }
}

checkTables();
