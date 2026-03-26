import { Router } from "express";
import {
  getCategories,
  createCategory,
  getMenuItems,
  createMenuItem,
  getDietaryRestrictions,
} from "../controllers/menuController.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", createCategory);

export default router;