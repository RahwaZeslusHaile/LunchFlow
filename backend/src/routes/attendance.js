import { Router } from "express";
import { getAttendance } from "../controllers/attendanceController.js";

const router = Router();

router.get("/", getAttendance);


export default router;