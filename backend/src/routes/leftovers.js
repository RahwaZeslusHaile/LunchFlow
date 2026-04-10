import { saveLeftovers, getLeftovers } from "../controllers/leftoverController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/:order_id", requireAuth, getLeftovers);
router.post("/", requireAuth, saveLeftovers);

export default router;
