import { Router } from "express";
import {
  getCategories,
  createCategories,
  getMenuItems,
  createMenuItem,
  getDietaryRestrictions,
} from "../controllers/menuController.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", createCategories);

export default router;