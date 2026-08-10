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
  max: 20,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});


async function testConnection(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await pool.query("SELECT NOW()");
      console.log("✅ Successfully connected to the database at:", res.rows[0].now);
      return true;
    } catch (err) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`⏱️ Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
}

// testConnection();

export default pool;