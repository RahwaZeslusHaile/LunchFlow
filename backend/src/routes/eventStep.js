import { Router } from "express";
import {
  fetchEventStep
} from "../controllers/eventStepsController.js";
const router = Router();

router.get("/:order_id", fetchEventStep);
export default router