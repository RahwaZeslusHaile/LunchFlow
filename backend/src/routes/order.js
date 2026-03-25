import { Router } from "express";
import {
  addItems,

} from "../controllers/orderController.js";

const router = Router();

router.post("/", addItems);

export default router;
