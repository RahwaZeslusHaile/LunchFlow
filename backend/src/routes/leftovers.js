import express from "express";
import { saveLeftovers } from "../controllers/leftoverController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, saveLeftovers);

export default router;
