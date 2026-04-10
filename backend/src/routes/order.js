import { Router } from "express";
import {
  addItems,
  fetchOrders,
  createEvent,
  getActiveOrder

} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/active", getActiveOrder);
router.post("/", addItems);
router.get("/", fetchOrders); 
router.post("/event", createEvent);

export default router;
