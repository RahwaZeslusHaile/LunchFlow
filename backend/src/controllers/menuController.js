import {
  fetchCategories,
  createCategory,
  getMenuItems,
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