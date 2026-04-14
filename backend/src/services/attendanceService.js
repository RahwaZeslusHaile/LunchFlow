import pool from "../db.js";
import { updateSingleStep } from "./eventStepsService.js";
import { recordSubmission } from "./reportService.js";

export async function fetchAttendance() {
  let query = `
    SELECT
      a.attendance_id,
      c.name AS class_name,
      a.session_date,
      a.trainee_count,
      a.volunteer_count
    FROM attendance a
    JOIN classes c ON a.class_id = c.class_id
    ORDER BY a.attendance_id
  `;

  const storedAttendanceData = await pool.query(query);

  const total = storedAttendanceData.rows.reduce(
    (sum, row) => sum + row.trainee_count + row.volunteer_count,
    0
  );
  return {
    data: storedAttendanceData.rows,
    total
  };
}

export async function insertAttendance({
  class_id,
  trainee_count,
  volunteer_count,
  halal_count,
  veg_count,
  userId,
  email,
  order_id
}) {
  if (!order_id) {
    throw new Error("order_id is required for attendance");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      INSERT INTO attendance (class_id, session_date, trainee_count, volunteer_count, order_id)
      VALUES ($1, CURRENT_DATE, $2, $3, $4)
      RETURNING *
      `,
      [class_id, trainee_count, volunteer_count, order_id]
    );

    const attendance_id = result.rows[0].attendance_id;

    if (halal_count > 0) {
      await client.query(
        `INSERT INTO attendance_diet (attendance_id, diet_id, count) VALUES ($1, $2, $3)`,
        [attendance_id, 3, halal_count]
      );
    }

    if (veg_count > 0) {
      await client.query(
        `INSERT INTO attendance_diet (attendance_id, diet_id, count) VALUES ($1, $2, $3)`,
        [attendance_id, 1, veg_count]
      );
    }

    await client.query("COMMIT");

    await updateSingleStep(order_id, 1, "done", userId);
    await recordSubmission(userId, email, "attendance", { class_id, trainee_count, volunteer_count, halal_count, veg_count, order_id }, order_id);

    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getAttendanceStatsByOrderId(order_id) {
  

  const result = await pool.query(
    `
    WITH attendance_totals AS (
      SELECT 
        COALESCE(SUM(trainee_count + volunteer_count), 0) as total_attendance
      FROM attendance
      WHERE order_id = $1
    ),
    dietary_totals AS (
      SELECT 
        COALESCE(SUM(CASE WHEN diet_id = 3 THEN count ELSE 0 END), 0) as total_halal,
        COALESCE(SUM(CASE WHEN diet_id = 1 THEN count ELSE 0 END), 0) as total_veg
      FROM attendance a
      JOIN attendance_diet ad ON a.attendance_id = ad.attendance_id
      WHERE a.order_id = $1
    )
    SELECT 
      (SELECT total_attendance FROM attendance_totals) as total_attendance,
      (SELECT total_halal FROM dietary_totals) as total_halal,
      (SELECT total_veg FROM dietary_totals) as total_veg
    `,
    [order_id]
  );
  return result.rows[0];
}
