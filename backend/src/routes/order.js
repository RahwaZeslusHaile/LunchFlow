import { Router } from "express";
import {
  addItems,
  fetchOrders,
  createEvent
} from "../controllers/orderController.js";

import { fetchLatestOrders } from "../controllers/orderHistoryController.js";

const router = Router();

router.post("/", addItems);
router.get("/", fetchOrders);
router.post("/event", createEvent);
router.get("/latest", fetchLatestOrders);
// router.delete("/:id", deleteOrder);

export default router;