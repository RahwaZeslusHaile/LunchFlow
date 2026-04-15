import pool from "../db.js";

export async function healthCheckController(req, res) {
  try {
    const dbCheck = await pool.query("SELECT 1");
    res.status(200).json({ 
      ok: true, 
      database: "connected",
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error("❌ Health check database error:", error.message);
    res.status(503).json({ 
      ok: false, 
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString() 
    });
  }
}
