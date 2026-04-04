import pool from "../db.js";

export async function createEventStep(order_id, step_order, assigned_admin) {
  const result = await pool.query(
    `INSERT INTO event_steps 
     (order_id, step_order, assigned_admin)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [order_id, step_order, assigned_admin]
  );

  return result.rows[0];
}


export async function getEventStep(order_id) {
   const dbStoredEventStep = await pool.query("SELECT * FROM event_steps where order_id=$1",[order_id]);


  return dbStoredEventStep.rows;
    
}