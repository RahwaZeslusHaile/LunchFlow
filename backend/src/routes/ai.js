import express from "express";
import { suggestOrderController } from "../controllers/aiController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/suggest-order", requireAuth, suggestOrderController);

export default router;
