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
  userId,
  email
}) {
  const result = await pool.query(
    `
    INSERT INTO attendance (class_id, session_date, trainee_count, volunteer_count)
    VALUES ($1, CURRENT_DATE, $2, $3)
    RETURNING *
    `,
    [class_id, trainee_count, volunteer_count]
  );

  const orderRes = await pool.query("SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1");
  const order_id = orderRes.rows.length > 0 ? orderRes.rows[0].order_id : null;
  if (order_id) {
    await updateSingleStep(order_id, 1, "done", userId);
  }
  
  await recordSubmission(userId, email, "attendance", { class_id, trainee_count, volunteer_count });

  return result.rows[0];
}
