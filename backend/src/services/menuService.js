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


export async function fetchMenuItems() {
  const dbStoredMenuItems = await pool.query(`
  SELECT mi.menu_item_id, mi.name, mc.name AS category, dr.name AS diet
  FROM menu_items mi
  JOIN menu_categories mc ON mi.category_id = mc.category_id
  JOIN dietary_restrictions dr ON mi.diet_id = dr.diet_id
  ORDER BY mi.menu_item_id
  `);
  return dbStoredMenuItems.rows;
}
