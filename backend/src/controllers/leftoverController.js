import { saveLeftoversService, getLeftoversByOrderId } from "../services/leftoverService.js";

export async function getLeftovers(req, res) {
  try {
    const { order_id } = req.params;
    if (!order_id) {
      return res.status(400).json({ error: "Missing order_id" });
    }
    const leftovers = await getLeftoversByOrderId(order_id);
    res.json(leftovers);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch leftovers" });
  }
}

export async function saveLeftovers(req, res) {
  try {
    const { items, order_id, date } = req.body;
    if (!Array.isArray(items) || !order_id) {
      return res.status(400).json({ error: "Missing items or order_id" });
    }
    await saveLeftoversService(date, items, req.user.userId, req.user.email, order_id);
    res.status(201).json({ message: "Leftovers saved" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to save leftovers" });
  }
}

