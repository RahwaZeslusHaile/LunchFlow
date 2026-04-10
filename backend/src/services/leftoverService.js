import pool from "../db.js";
import { updateSingleStep } from "./eventStepsService.js";
import { recordSubmission } from "./reportService.js";

export async function saveLeftoversService(date, items, userId, email, order_id) {
  if (!order_id) {
    throw new Error("order_id is required for leftovers");
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const item of items) {
      if (!item.menu_item_id || typeof item.quantity !== "number") {
        throw new Error("Missing required leftover item fields: " + JSON.stringify(item));
      }
      await client.query(
        `INSERT INTO leftover_food (menu_item_id, quantity, leftover_date, notes, order_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (menu_item_id, leftover_date)
         DO UPDATE SET quantity = EXCLUDED.quantity, notes = EXCLUDED.notes, order_id = EXCLUDED.order_id`,
        [item.menu_item_id, 
          item.quantity, 
          item.leftover_date || null, 
          item.notes || null,
          order_id]);
    }
    await client.query("COMMIT");

    await updateSingleStep(order_id, 2, "done", userId);
    await recordSubmission(userId, email, "leftover", { date, items, order_id });

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getLeftoversByOrderId(order_id) {
  const result = await pool.query(
    `SELECT menu_item_id, quantity 
     FROM leftover_food 
     WHERE order_id = $1`,
    [order_id]
  );
  return result.rows;
}
