const mysql = require('mysql2/promise');

async function testConn() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'rootpassword',
      database: 'travelagent'
    });
    console.log('Connection success');
    await conn.end();
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConn();
