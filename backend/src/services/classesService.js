import pool from "../db.js";

export async function fetchClasses() {
  const storedClassesData = await pool.query(
    "SELECT * FROM classes ORDER BY class_id"
  );
  return storedClassesData.rows;
}
