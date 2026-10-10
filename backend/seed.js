const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
  let connection;
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    await connection.query(`
      INSERT IGNORE INTO admin_users (username, password, name) 
      VALUES ('Gnanasudha18@gmail.com', 'GnanaSudha@336', 'Gnana Sudha Admin');
    `);
    await connection.query(`
      INSERT IGNORE INTO customers (name, email, password) 
      VALUES ('Vamsi', 'Vamsipallela31@gmail.com', 'Vamsi@123');
    `);
    console.log('Seed done');
  } catch(e) {
    console.error(e);
  } finally {
    if (connection) connection.end();
  }
}
seed();
