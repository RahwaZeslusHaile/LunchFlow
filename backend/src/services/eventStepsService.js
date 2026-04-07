import pool from "../db.js";

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


// export async function getEventStep(order_id) {
//    const dbStoredEventStep = await pool.query("SELECT * FROM event_steps where order_id=$1",[order_id]);


//   return dbStoredEventStep.rows;
    
// }


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