import {
  fetchCategories,
  addCategory,
  fetchMenuItems,
  createMenuItem,
  getDietaryRestrictions,
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
    const newcategory = await addCategory(req.body.name);
    res.json(newcategory);
  } catch (err) {
    sendError(res, err);
  }
}

export async function getMenuItems(req, res) {
  try {
    const menueItems = await fetchMenuItems();
    res.json(menueItems);
  } catch (err) {
    sendError(res, err);
  }
}