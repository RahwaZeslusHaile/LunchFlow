import pool from "../db.js";

export async function fetchAttendance(date) {
  let query = `
    SELECT
      a.attendance_id,
      c.name AS class_name,
      a.session_date,
      a.trainee_count,
      a.volunteer_count
    FROM attendance a
    JOIN classes c ON a.class_id = c.class_id
  `;

  const values = [];

  if (date) {
    query += ` WHERE a.session_date = $1`;
    values.push(date);
  }

  query += ` ORDER BY a.attendance_id`;

  const storedAttendanceData = await pool.query(query, values);

  const total = storedAttendanceData.rows.reduce(
    (sum, row) => sum + row.trainee_count + row.volunteer_count,
    0
  );
  return {
    data: storedAttendanceData.rows,
    total
  };
}
