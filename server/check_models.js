import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log("🔍 Checking available models for your API key...");
    // ⚠️ Note: We are explicitly calling the model listing function
    // Use the getGenerativeModel method to access the API wrapper, 
    // but we need the specific manager to list models usually.
    // However, the simplest way in the node SDK is usually via the direct fetch if the helper isn't exposed.
    // Let's try the SDK's built-in way if available, or just try a standard request.
    
    // Actually, let's just try to fix the library first.
    // Running this simple fetch is often more reliable for debugging:
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("\n✅ AVAILABLE MODELS:");
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
           console.log(`   - ${m.name.replace("models/", "")}`);
        }
      });
    } else {
      console.log("❌ No models found or error:", data);
    }

  } catch (err) {
    console.error("❌ Error listing models:", err);
  }
}

listModels();