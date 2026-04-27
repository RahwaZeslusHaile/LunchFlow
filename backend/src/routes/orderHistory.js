import { Router } from "express";
import { fetchLatestOrders } from "../controllers/orderHistoryController.js";

const router = Router();

router.get("/", fetchLatestOrders);

export default router;