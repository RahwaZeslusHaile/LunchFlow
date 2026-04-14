import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not set in environment.");
    process.exit(1);
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const response = await genAI.listModels();
    if (response.models && response.models.length > 0) {
      console.log("Available Gemini models:");
      response.models.forEach((model) => {
        console.log(`- ${model.name}`);
      });
    } else {
      console.log("No models found for this API key.");
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
