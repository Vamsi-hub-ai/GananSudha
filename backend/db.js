const mysql = require('mysql2/promise');
require('dotenv').config();
const { executeLocalQuery } = require('./localStore');

let realPool = null;
let mysqlAvailable = null; // null = untried, true = working, false = using fallback

if (process.env.DATABASE_URL) {
  try {
    realPool = mysql.createPool(process.env.DATABASE_URL);
  } catch (err) {
    console.warn('[DB] MySQL pool initialization error with DATABASE_URL:', err.message);
  }
} else if (process.env.DB_NAME && process.env.DB_USER) {
  try {
    realPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  } catch (err) {
    console.warn('[DB] MySQL pool initialization error with DB credentials:', err.message);
  }
}

const db = {
  async query(sql, values = []) {
    // If MySQL was already tested and failed, use local fallback directly
    if (mysqlAvailable === false || !realPool) {
      return executeLocalQuery(sql, values);
    }

    try {
      const result = await realPool.query(sql, values);
      if (mysqlAvailable === null) {
        mysqlAvailable = true;
        console.log('[DB] Connected successfully to MySQL database.');
      }
      return result;
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND') {
        if (mysqlAvailable !== false) {
          mysqlAvailable = false;
          console.warn(`[DB] MySQL server unreachable (${err.code}). Using local JSON fallback for development.`);
        }
        return executeLocalQuery(sql, values);
      }
      throw err;
    }
  }
};

module.exports = db;
