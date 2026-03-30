import { saveLeftoversService } from "../services/leftoverService.js";

export async function saveLeftovers(req, res) {
  try {
    const { date, items } = req.body;
    if (!date || !Array.isArray(items)) {
      return res.status(400).json({ error: "Missing date or items" });
    }
    await saveLeftoversService(date, items);
    res.status(201).json({ message: "Leftovers saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save leftovers" });
  }
}
