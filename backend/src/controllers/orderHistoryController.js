import { getLatestOrders } from "../services/orderHistoryService.js";

function sendError(res, err) {
  console.error(err);
  return res.status(500).json({ message: "Database error" });
}

export async function fetchLatestOrders(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const data = await getLatestOrders(limit, offset);
    res.json(data);
  } catch (err) {
    sendError(res, err);
  }
}