import pool from "../db.js";

export async function saveLeftoversService(date, items) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const item of items) {
      if (!item.menu_item_id || !item.class_id || typeof item.quantity !== "number") {
        throw new Error("Missing required leftover item fields");
      }
      await client.query(
        `INSERT INTO leftover_food (menu_item_id, class_id, quantity, leftover_date, notes)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (menu_item_id, class_id, leftover_date)
         DO UPDATE SET quantity = EXCLUDED.quantity, notes = EXCLUDED.notes`,
        [item.menu_item_id, item.class_id, item.quantity, date, item.notes || null]
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
