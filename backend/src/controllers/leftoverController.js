import { saveLeftoversService } from "../services/leftoverService.js";

export async function saveLeftovers(req, res) {
  try {
    const { items ,quantity} = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Missing items" });
    }
    await saveLeftoversService(items);
    res.status(201).json({ message: "Leftovers saved" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to save leftovers" });
  }
}
