import { Router } from "express";
import { getAttendance } from "../controllers/attendanceController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createAttendance } from "../controllers/attendanceController.js";

const router = Router();

router.get("/", requireAuth, getAttendance);
router.post("/", requireAuth, createAttendance);


export default router;