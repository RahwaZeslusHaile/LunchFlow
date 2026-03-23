import pool from "../db.js";

export async function fetchAttendance() {
  const storedAttendanceData = await pool.query(`
  SELECT
    a.attendance_id,
    c.name AS class_name,
    a.session_date,
    a.trainee_count,
    a.volunteer_count
  FROM attendance a
  JOIN classes c ON a.class_id = c.class_id
  ORDER BY a.attendance_id  
  `);
  return storedAttendanceData.rows;
}
