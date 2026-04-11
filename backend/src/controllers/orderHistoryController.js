import { getLatestOrders } from "../services/orderHistoryService.js";

function sendError(res, err) {
  console.error(err);
  return res.status(500).json({ message: "Database error" });
}

export async function fetchLatestOrders(req, res) {
  try {
    const data = await getLatestOrders();
    res.json(data);
  } catch (err) {
    sendError(res, err);
  }
}