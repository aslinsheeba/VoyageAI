import { askGemini } from "../services/gemini.service.js";
import Trip from "../models/Trip.js";

export async function chatAI(req, res) {
  try {
    const { message, tripId } = req.body;

    const SYSTEM_PROMPT = `
You are VoyageAI, an AI travel planner.

You MUST ALWAYS respond in valid JSON.

If the user mentions:
- add
- include
- plan
- restaurant
- hotel
- place
- food
- sightseeing

ASSUME they want to ADD it to the trip.

When adding a place, respond ONLY in this format:

{
  "reply": "Short friendly confirmation",
  "action": "ADD_PLACE",
  "payload": {
    "type": "food | hotel | sight",
    "query": "clean place name"
  }
}

If no place is implied, respond:

{
  "reply": "Helpful travel message",
  "action": null
}

DO NOT explain.
DO NOT add markdown.
DO NOT add extra text.
`;

    const fullPrompt = `${SYSTEM_PROMPT}\nUser: ${message}`;

    const aiResponse = await askGemini(fullPrompt);

    res.json(aiResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
}
