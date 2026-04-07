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
router.get("/menu-items", getMenuItems);
router.post("/menu-items", createMenuItem);

router.get("/dietary-restrictions", getDietaryRestrictions);

export default router;