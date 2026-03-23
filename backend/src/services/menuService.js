import pool from "../db.js";

export async function fetchCategories() {
   const dbStoredCategories = await pool.query("SELECT * FROM menu_categories ORDER BY category_id");
   return dbStoredCategories.rows;
}

export async function addCategory(name) {
  const addNewDBCategory = await pool.query(
    "INSERT INTO menu_categories (name) VALUES ($1) RETURNING *",
    [name]
  );
  return addNewDBCategory.rows[0];
}