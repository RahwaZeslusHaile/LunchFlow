import { Router } from "express";
import {
  addItems,
  fetchOrders

} from "../controllers/orderController.js";

const router = Router();

router.post("/", addItems);
router.get("/", fetchOrders); 

export default router;
