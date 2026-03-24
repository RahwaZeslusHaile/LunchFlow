import { Router } from "express";
import { getAttendance } from "../controllers/attendanceController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireAuth, getAttendance);


export default router;