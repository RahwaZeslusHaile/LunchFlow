import {
  fetchCategories,
  addCategory,
  fetchMenuItems,
  createMenuItems,
  fetchDietaryRestrictions,
} from "../services/menuService.js";

function sendError(res, err) {
  console.error(err);
  if (err.status) {
    return res.status(err.status).json(err.message);
  }
  return res.status(500).json("Database error");
}

export async function getCategories(req, res) {
  try {
    const categories = await fetchCategories();
    res.json(categories);
  } catch (err) {
    sendError(res, err);
  }
}

export async function createCategories(req, res) {
  try {
    const newCategory = await addCategory(req.body.name);
    res.json(newCategory);
  } catch (err) {
    sendError(res, err);
  }
}

export async function getMenuItems(req, res) {
  try {
    const menuItems = await fetchMenuItems();
    res.json(menuItems);
  } catch (err) {
    sendError(res, err);
  }
}

export async function createMenuItem(req, res) {
  try {
    // Fix: service expects separate arguments . 
    const { name, category_id, diet_id } = req.body;
    const newMenuItem = await createMenuItems(name, category_id, diet_id) 
    res.json(newMenuItem);
  } catch (err) {
    sendError(res, err);
  }
}


export async function getDietaryRestrictions(req, res) {
  try {
    const dietTypes = await fetchDietaryRestrictions();
    res.json(dietTypes);
  } catch (err) {
    sendError(res, err);
  }
}