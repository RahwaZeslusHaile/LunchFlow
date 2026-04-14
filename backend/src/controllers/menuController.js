import {
  fetchCategories,
  addCategory,
  fetchMenuItems,
  createMenuItems,
  fetchDietaryRestrictions,
  deleteMenuItemById,
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
  
    const { name, category_id, diet_id } = req.body;
    if (!name || !category_id || !diet_id) {
      return res.status(400).json({
        error: "name, category_id and diet_id are required",
      });
    }
    const newMenuItem = await createMenuItems(name, category_id, diet_id);
    res.status(201).json(newMenuItem);
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

export async function deleteMenuItem(req, res) {
  try {
    const { id } = req.params;

    await deleteMenuItemById(id);

    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
}