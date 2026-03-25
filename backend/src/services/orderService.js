import pool from "../db.js";

export async function addOrder(order_date,attendance) {
     const dbStoredOrder = await pool.query(
    "INSERT INTO orders (order_date,attendance) VALUES ($1, $2)  RETURNING *",
    [order_date,attendance]
  );
return dbStoredOrder.rows[0];
}

export async function addOrderItems (order_id,menu_item_id,quantity) {
     const dbStoredOrderItems = await pool.query(
    "INSERT INTO order_items (order_id,menu_item_id,quantity) VALUES ($1, $2,$3)  RETURNING *",
    [order_id,menu_item_id,quantity]
  );
   return dbStoredOrderItems.rows[0];
}