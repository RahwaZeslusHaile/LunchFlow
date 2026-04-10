import { Router } from "express";
import { getAttendance, createAttendance, getAttendanceStats } from "../controllers/attendanceController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireAuth, getAttendance);
router.post("/", requireAuth, createAttendance);
router.get("/stats/:order_id", requireAuth, getAttendanceStats);

export default router;