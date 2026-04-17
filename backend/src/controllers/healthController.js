import pool from "../db.js";

export async function healthCheckController(req, res) {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(503).json({ ok: false });
  }
}
