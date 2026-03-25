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


export async function getOrdersByDate(date) {
  const result = await pool.query(
    `
    SELECT 
      o.order_id,
      o.order_date,
      o.attendance,
      m.name,
      oi.quantity
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu_items m ON oi.menu_item_id = m.menu_item_id
    WHERE o.order_date = $1
    `,
    [date]
  );

  return result.rows;
}