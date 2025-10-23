import "dotenv/config";

export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "3000", 10),
  database: {
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "3307", 10),
    user: process.env.DB_USER ?? "****",
    password: process.env.DB_PASS ?? "*****",
    database: process.env.DB_NAME ?? "****",
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT ?? "10", 10),
  },
};
