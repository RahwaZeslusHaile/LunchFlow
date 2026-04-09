import express from "express";
import { saveLeftovers } from "../controllers/leftoverController.js";

const router = express.Router();

router.post("/", saveLeftovers);

export default router;
