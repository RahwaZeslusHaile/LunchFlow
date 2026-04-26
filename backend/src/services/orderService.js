import pool from "../db.js";
import { createEventStep, updateSingleStep } from "./eventStepsService.js";
import { recordSubmission } from "./reportService.js";

export async function createOrderWithItems(date, attendance, items) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO orders (order_date, attendance)
       VALUES ($1, $2)
       RETURNING order_id`,
      [date, attendance]
    );

    const order_id = orderResult.rows[0].order_id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity)
         VALUES ($1, $2, $3)`,
        [order_id, item.menu_item_id, item.quantity]
      );
    }

    await client.query("COMMIT");

    return order_id;

  } catch (err) {
    await client.query("ROLLBACK");

    console.error(err);

    throw new Error("Failed to create order with items");
  } finally {
    client.release();
  }
}


export async function updateOrderWithItems(order_id, attendance, items, userId, email) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE orders SET attendance = $1 WHERE order_id = $2`,
      [attendance, order_id]
    );

    await client.query(`DELETE FROM order_items WHERE order_id = $1`, [order_id]);

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity)
         VALUES ($1, $2, $3)`,
        [order_id, item.menu_item_id, item.quantity]
      );
    }

   
    await recordSubmission(userId, email, "order", { order_id, attendance, items }, order_id);

    await client.query("COMMIT");
    return order_id;

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in updateOrderWithItems:", err);
    throw new Error("Failed to update order items");
  } finally {
    client.release();
  }
}

export async function createOrderWithSteps(order_date, attendance,assigned_admin) {
  const order_id = await createOrder(order_date, attendance,assigned_admin);

  for (let i = 1; i <= 3; i++) {
    await createEventStep(order_id, i,assigned_admin);
  }

  return order_id;
}


export async function createOrder(order_date, attendance, assigned_admin) {
  const result = await pool.query(
    `INSERT INTO orders (order_date, attendance, assigned_admin)
     VALUES ($1, $2, $3)
     RETURNING order_id`,
    [order_date, attendance, assigned_admin]
  );

  return result.rows[0].order_id;
}
export async function getOrdersByDate(date) {
  const result = await pool.query(
    `
    SELECT 
      o.order_id,
      o.order_date,
      o.attendance,
      json_agg(
        json_build_object(
          'menu_item_id', oi.menu_item_id,
          'name', m.name,
          'quantity', oi.quantity
        )
      ) AS items
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu_items m ON oi.menu_item_id = m.menu_item_id
    WHERE o.order_date = $1
    GROUP BY o.order_id, o.order_date, o.attendance
    ORDER BY o.order_id
    `,
    [date]
  );

  return result.rows;
}

export async function deleteOrderById(order_id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM form_submissions WHERE order_id = $1', [order_id]);
    await client.query('DELETE FROM attendance WHERE order_id = $1', [order_id]);
    await client.query('DELETE FROM leftover_food WHERE order_id = $1', [order_id]);
    await client.query('DELETE FROM invites WHERE order_id = $1', [order_id]);
    await client.query('DELETE FROM orders WHERE order_id = $1', [order_id]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
export async function getLatestOrder() {
  const result = await pool.query(
    `SELECT order_id, order_date, attendance 
     FROM orders 
     ORDER BY created_at DESC 
     LIMIT 1`
  );
  return result.rows[0];

}