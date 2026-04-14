import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "root",
  password: "password",
  database: "mydatabase"
});

async function test() {
  const res = await pool.query('SELECT * FROM event_steps ORDER BY order_id DESC LIMIT 10;');
  console.log('--- EVENT STEPS ---');
  console.table(res.rows);
  const res2 = await pool.query('SELECT * FROM attendance ORDER BY order_id DESC LIMIT 10;');
  console.log('--- ATTENDANCE ---');
  console.table(res2.rows);
  const res3 = await pool.query('SELECT * FROM orders ORDER BY order_id DESC LIMIT 10;');
  console.log('--- ORDERS ---');
  console.table(res3.rows);
  pool.end();
}
test();
