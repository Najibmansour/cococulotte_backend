// db/postgres.js (or wherever your original file lives)
import { Pool } from "pg";
import { config } from "../config/index.js";

// Prefer a single DATABASE_URL when available (Render gives you this)
const connectionString = process.env.DATABASE_URL || null;

console.log("Database config:", {
  host: connectionString ? "from DATABASE_URL" : config.database.host,
  port: connectionString ? "from DATABASE_URL" : config.database.port,
  user: connectionString ? "from DATABASE_URL" : config.database.user,
  database: connectionString ? "from DATABASE_URL" : config.database.database,
});

// Create connection pool
const pool = new Pool(
  connectionString
    ? {
        connectionString,
        // Render Postgres requires SSL
        // ssl: { rejectUnauthorized: false },
        max: config.database?.connectionLimit || 10,
      }
    : {
        host: config.database.host,
        port: Number(config.database.port) || 5432,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        ssl: { rejectUnauthorized: false }, // keep for Render; for local non-SSL you can remove this
        max: config.database?.connectionLimit || 10,
      }
);

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1;");
    client.release();
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Execute query with error handling
export const executeQuery = async (query, params = []) => {
  try {
    const { rows } = await pool.query(query, params);
    return rows; // pg returns { rows, rowCount, ... }
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

// Get a client from the pool (remember to release it)
export const getConnection = async () => {
  return await pool.connect(); // call client.release() when done
};

// Close the connection pool
export const closePool = async () => {
  await pool.end();
};

export default pool;
