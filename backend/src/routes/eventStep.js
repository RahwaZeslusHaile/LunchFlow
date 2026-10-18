import { Router } from "express";
import {
  fetchEventStep,
  updateStepStatus
} from "../controllers/eventStepsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/:order_id", fetchEventStep);
router.put("/:order_id/status", requireAuth, updateStepStatus);
export default router;