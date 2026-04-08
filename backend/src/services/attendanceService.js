import pool from "../db.js";
import { updateStepStatus } from "./eventStepsService.js";
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

  await updateStepStatus(1, "done");
  
  await recordSubmission(userId, email, "attendance", { class_id, trainee_count, volunteer_count });

  return result.rows[0];
}
