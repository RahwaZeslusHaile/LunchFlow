import { Router } from "express";
import { getClasses } from "../controllers/classesController.js";

const router = Router();

router.get("/", getClasses);

export default router;