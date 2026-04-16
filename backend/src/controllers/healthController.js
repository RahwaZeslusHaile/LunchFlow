import pool from "../db.js";

export async function healthCheckController(req, res) {
  try {
    const dbCheck = await Promise.race([
      pool.query("SELECT 1"),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Database timeout")), 2000))
    ]);
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
