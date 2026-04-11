import pool from "../db.js";

export async function getLatestOrders() {
  const result = await pool.query(`
    SELECT 
      o.order_id,
      o.order_date AS event_date,
      o.attendance AS attendees,

      COALESCE(a.name, SPLIT_PART(a.email, '@', 1)) AS admin_name,
      a.email AS admin_email,

      CASE 
        WHEN EXISTS (
          SELECT 1 FROM event_steps es 
          WHERE es.order_id = o.order_id
        )
        AND NOT EXISTS (
          SELECT 1 FROM event_steps es 
          WHERE es.order_id = o.order_id
          AND es.step_status != 'done'
        )
        THEN 'Completed'
        ELSE 'Pending'
      END AS order_status,

      (
        SELECT COALESCE(JSON_AGG(
          JSON_BUILD_OBJECT(
            'name', mi.name,
            'quantity', oi.quantity
          )
        ), '[]')
        FROM order_items oi
        JOIN menu_items mi 
          ON oi.menu_item_id = mi.menu_item_id
        WHERE oi.order_id = o.order_id
      ) AS details

    FROM orders o

    LEFT JOIN account a 
      ON o.assigned_admin = a.account_id

    WHERE o.order_id IN (
      SELECT order_id 
      FROM orders 
      ORDER BY order_id DESC 
      LIMIT 10
    )

    ORDER BY o.order_id DESC
  `);

  return result.rows;
}



