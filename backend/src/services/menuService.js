import pool from "../db.js";

export async function fetchCategories() {
   const dbStoredCategories = await pool.query("SELECT * FROM menu_categories ORDER BY category_id");
   return dbStoredCategories.rows;
}