import { saveLeftoversService } from "../services/leftoverService.js";

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

