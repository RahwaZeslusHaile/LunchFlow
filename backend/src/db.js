import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

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

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("ℹ️ Skipping auto-seeding: SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD not set");
    return;
  }

  try {
    const adminCheck = await pool.query("SELECT * FROM account WHERE role_id = 1 LIMIT 1");
    if (adminCheck.rows.length === 0) {
      console.log(`🌱 Seeding default admin account: ${email}`);
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO account (email, pass, role_id) VALUES ($1, $2, $3)",
        [email, hashedPassword, 1]
      );
      console.log("✅ Admin account seeded successfully");
    } else {
      console.log("ℹ️ Admin account already exists, skipping seed");
    }
  } catch (err) {
    console.error("❌ Error during auto-seeding:", err.message);
  }
}

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
  } else {
    console.log("✅ Successfully connected to the database");
    
    // Check for existing tables
    pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'", async (tErr, tRes) => {
      if (!tErr) {
        const tables = tRes.rows.map(r => r.table_name).join(", ");
        console.log("📋 Existing tables:", tables || "NONE");
        
        if (tables.includes("account")) {
          await seedAdmin();
        }
      }
    });
  }
});

export default pool;