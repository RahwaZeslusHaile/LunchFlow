import { suggestOrderQuantities } from "../services/geminiService.js";

export async function suggestOrderController(req, res) {
  try {
    const { attendance, diets, items } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ error: "Missing items data" });
    }

    const suggestions = await suggestOrderQuantities({ attendance, diets, items });
    return res.json({ suggestions });
  } catch (error) {
    console.error("AI Order Suggestion Error:", error);
    return res.status(500).json({ error: "Failed to generate AI suggestions", details: error.message });
  }
}
