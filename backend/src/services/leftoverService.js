import pool from "../db.js";
import { updateStepStatus } from "./eventStepsService.js";
import { recordSubmission } from "./reportService.js";

export async function saveLeftoversService(date, items, userId, email) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const item of menu_items) {
      if (!item.menu_item_id || typeof item.quantity !== "number") {
        throw new Error("Missing required leftover item fields: " + JSON.stringify(item));
      }
      await client.query(
        `INSERT INTO leftover_food (menu_item_id, quantity, leftover_date, notes)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (menu_item_id, leftover_date)
         DO UPDATE SET quantity = EXCLUDED.quantity, notes = EXCLUDED.notes`,
      [item.menu_item_id, 
        item.quantity, 
        item.leftover_date || null, 
        item.notes || null]);
    }
    await client.query("COMMIT");

    await updateStepStatus(2, "done");
    
    await recordSubmission(userId, email, "leftover", { date, items });

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
