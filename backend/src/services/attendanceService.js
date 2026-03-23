import pool from "../db.js";

export async function fetchAttendance() {
  const storedAttendanceData = await pool.query(
    "SELECT * FROM attendance ORDER BY attendance_id"
  );
  return storedAttendanceData.rows;
}