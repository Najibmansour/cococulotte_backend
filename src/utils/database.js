// db/postgres.js
import { Pool } from "pg";
import { config } from "../config/index.js"; // assumes this reads env

const usingUrl = !!process.env.DATABASE_URL;

// Helpful log (safe; doesn't print password)
console.log("Database config:", {
  via: usingUrl ? "DATABASE_URL" : "individual vars",
  host: usingUrl ? "from DATABASE_URL" : config.database.host,
  user: usingUrl ? "from DATABASE_URL" : config.database.user,
  db: usingUrl ? "from DATABASE_URL" : config.database.database,
  // ssl: usingUrl ? "maybe" : "disabled",
});

// Pool config for Cloud Run + Cloud SQL (Unix socket)
const socketConfig = {
  host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`, // e.g. cococulottes:us-central1:cococulotte
  user: process.env.DB_USER || config.database.user,
  password: process.env.DB_PASS || config.database.password,
  database: process.env.DB_NAME || config.database.database,
  // DO NOT set ssl when using the Unix socket
  max: Number(
    process.env.DB_POOL_MAX || config.database?.connectionLimit || 10
  ),
  // good hygiene:
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

const urlConfig = {
  connectionString: process.env.DATABASE_URL,
  // Only enable ssl here if your DATABASE_URL provider requires it
  // ssl: { rejectUnauthorized: false },
  max: Number(
    process.env.DB_POOL_MAX || config.database?.connectionLimit || 10
  ),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

const pool = new Pool(usingUrl ? urlConfig : socketConfig);

// Health check
export const testConnection = async () => {
  try {
    const { rows } = await pool.query("SELECT 1");
    console.log("✅ Database connected:", rows[0]);
    return true;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    return false;
  }
};

export const executeQuery = async (q, params = []) => {
  try {
    const { rows } = await pool.query(q, params);
    return rows;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
};

export const getConnection = () => pool.connect();
export const closePool = () => pool.end();

export default pool;
