import mysql from "mysql2/promise";
import { config } from "../config/index.js";

// Create connection pool
console.log("Database config:", {
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  database: config.database.database,
});

const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  connectionLimit: config.database.connectionLimit,
  // acquireTimeout: 60000,
  // timeout: 60000,
  // reconnect: true,
});

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Execute query with error handling
export const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

// Get a connection from the pool
export const getConnection = async () => {
  return await pool.getConnection();
};

// Close the connection pool
export const closePool = async () => {
  await pool.end();
};

export default pool;
