import { Router } from "express";
import {
  addItems,
  fetchOrders,
  createEvent,
  getActiveOrder

} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { fetchLatestOrders } from "../controllers/orderHistoryController.js";

const router = Router();

router.get("/active", getActiveOrder);
// router.post("/", addItems);
router.post("/", requireAuth, addItems);
router.get("/", fetchOrders);
router.post("/event", createEvent);
router.get("/latest", fetchLatestOrders);

export default router;