import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const useSsl = process.env.DB_SSL === "true";

const pool = new Pool({
  user: process.env.DB_USER ,
  host: process.env.DB_HOST ,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: useSsl ? { rejectUnauthorized: false }
     : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});


pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
  } else {
    console.log("✅ Successfully connected to the database");
  }
});

export default pool;