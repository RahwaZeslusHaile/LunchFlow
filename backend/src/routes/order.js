import { Router } from "express";
import {
  addItems,
  fetchOrders,
  createEvent

} from "../controllers/orderController.js";

const router = Router();

router.post("/", addItems);
router.get("/", fetchOrders); 
router.post("/event", createEvent);
export default router;
