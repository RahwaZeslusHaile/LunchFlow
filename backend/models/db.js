import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const useSsl = process.env.DB_SSL === "true";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "launch",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT || 5432),
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

export default pool;