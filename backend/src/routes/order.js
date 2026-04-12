import { Router } from "express";
import {
  addItems,
  fetchOrders,
  createEvent,
  getActiveOrder,
  deleteOrder
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { fetchLatestOrders } from "../controllers/orderHistoryController.js";

const router = Router();

router.get("/active", getActiveOrder);
router.post("/", requireAuth, addItems);
router.get("/", fetchOrders);
router.post("/event", createEvent);
router.delete("/event/:id", deleteOrder);
router.get("/latest", fetchLatestOrders);

export default router;