import pool from "../db.js";

export async function updateSingleStep(order_id, step_position, step_status, volunteer_id) {
  await pool.query(
    `UPDATE event_steps
     SET step_status = $1, assigned_volunteer = $4
     WHERE order_id = $2 AND step_position = $3`,
    [step_status, order_id, step_position, volunteer_id]
  );
}

export async function createEventStep(order_id, step_position, assigned_admin) {
  const result = await pool.query(
    `INSERT INTO event_steps 
     (order_id,step_position, assigned_admin)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [order_id,step_position, assigned_admin]
  );

  return result.rows[0];
}

export async function getLatestEventSteps() {
  const result = await pool.query(
    `SELECT 
       es.step_position,
       es.step_status,
       a.email,
       o.order_date
     FROM event_steps es
     LEFT JOIN account a ON es.assigned_admin = a.account_id
     JOIN orders o ON es.order_id = o.order_id
     WHERE es.order_id = (
       SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1
     )`
  );

  return result.rows;
}