import { Router } from "express";
import {
  getCategories,
  createCategories,
  getMenuItems,
  createMenuItem,
  getDietaryRestrictions,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/categories", getCategories);
router.post("/categories", createCategories);
router.get("/menu-items", getMenuItems);
router.post("/menu-items", createMenuItem);
router.delete("/menu-items/:id", deleteMenuItem);


router.get("/dietary-restrictions", getDietaryRestrictions);

export default router;