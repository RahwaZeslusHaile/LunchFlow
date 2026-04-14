import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Gemini API initialized successfully.");
  } else {
    console.warn("GEMINI_API_KEY not found in environment variables. AI features will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini API:", error);
}

/**
 * Calls Gemini to suggest optimal order quantities.
 * @param {Object} data eventData containing attendance, leftovers, diets, and menu.
 * @returns {Array} Array of { menu_item_id, suggested_quantity }
 */
export async function suggestOrderQuantities(data) {
  if (!genAI) throw new Error("Gemini API is not configured");

  const model = genAI.getGenerativeModel(
    { model: "gemini-2.5-flash" },
    { apiVersion: "v1beta" }
  );

  const prompt = `
    INSTRUCTION: You are an expert catering assistant. You must respond with valid JSON ONLY. Output a JSON array of objects with 'menu_item_id' (number) and 'suggested_quantity' (number). No markdown, no text.

    Based on the following event data, suggest the optimal quantity to order for each menu item to ensure enough food for everyone while minimizing waste. Let's assume standard portions. Leftovers are already available, so we only need to order the DIFFERENCE.

    Total Attendance: ${data.attendance}
    Vegetarian: ${data.diets.veg}
    Halal: ${data.diets.halal}
    Other (No restriction): ${data.diets.other}

    Inventory Information:
    ${JSON.stringify(data.items, null, 2)}

    For each item, output the new 'suggested_quantity'. Make logical estimates (e.g., 1 wrap per person, 2 snacks, etc). Deduct the 'leftover' quantity from the total needed.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    const parsed = JSON.parse(cleanText);
    if (!Array.isArray(parsed)) throw new Error("AI did not return an array");
    return parsed;
  } catch (error) {
    console.error("Gemini suggestion failed:", error);
    throw new Error(error.message || "Failed to generate AI suggestions");
  }
}
