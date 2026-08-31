import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jawzaa_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
};

let pool = null;
let isConnected = false;

export async function getDbPool() {
  if (pool) return pool;

  try {
    // First test connection without database to create database if it doesn't exist
    const tempConn = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      port: DB_CONFIG.port,
    });

    await tempConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await tempConn.end();

    // Now create pool with target database
    pool = mysql.createPool(DB_CONFIG);
    await pool.query('SELECT 1');
    isConnected = true;
    console.log(`[Database] Successfully connected to MySQL database: ${DB_CONFIG.database}`);
    return pool;
  } catch (error) {
    console.warn(
      `[Database Warning] Could not connect to MySQL at ${DB_CONFIG.host}:${DB_CONFIG.port} (${error.message}). Running in mock/in-memory mode for development.`
    );
    isConnected = false;
    return null;
  }
}

export function isDbConnected() {
  return isConnected;
}

export default { getDbPool, isDbConnected };
