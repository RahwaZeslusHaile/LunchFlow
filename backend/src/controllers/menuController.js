import {
  getCategories,
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
