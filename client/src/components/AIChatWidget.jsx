import { useState } from "react";
import { sendMessage } from "../api/aiApi";
import { addPlace } from "../api/placeService";
import { getTrips } from "../api/tripsService";

export default function AIChatWidget({ tripId, user, setActiveTrip }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "I’m VoyageAI. I’ll assist you throughout today’s plan ✨",
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || thinking) return;

    const userMessage = input;

    // Show user message instantly
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setThinking(true);

    try {
      // 🔹 Ask Gemini backend
      const res = await sendMessage(userMessage, tripId);

      // ✅ ADD PLACE FLOW
      if (res.action === "ADD_PLACE" && res.payload) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: res.reply },
          { role: "ai", text: "📍 Adding place to your trip..." },
        ]);

        // TEMP coordinates (Geoapify comes next phase)
        await addPlace(tripId, {
          name: res.payload.query,
          lat: 11.9341,
          lng: 79.8300,
          cost: res.payload.type === "food" ? 400 : 0,
        });

        // 🔄 Refresh trips from DB
        const trips = await getTrips(user.uid);
        setActiveTrip(trips[0]);

        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "✅ Place added successfully!" },
        ]);
      }

      // ✅ NORMAL CHAT (NO ACTION)
      else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: res.reply || "😊 I'm here to help!",
          },
        ]);
      }
    } catch (err) {
      console.error("AI error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ Sorry, something went wrong. Try again.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <section className="mt-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-lg flex flex-col h-[280px]">

      {/* Header */}
      <div className="px-4 py-2 text-sm font-semibold text-white border-b border-white/10">
        🤖 AI Travel Assistant
        <span className="ml-2 text-xs text-white/50">(Gemini)</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-xl max-w-[85%] ${
              msg.role === "user"
                ? "ml-auto bg-sky-500/80 text-white"
                : "bg-white/10 text-white/90"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {thinking && (
          <div className="bg-white/10 px-3 py-2 rounded-xl w-fit animate-pulse text-white/70">
            AI is thinking…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Add places, hotels, food..."
          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none placeholder-white/40"
        />

        <button
          onClick={handleSend}
          disabled={thinking}
          className="px-4 rounded-xl bg-sky-500/80 hover:bg-sky-500 disabled:opacity-50 text-white text-sm transition"
        >
          Send
        </button>
      </div>
    </section>
  );
}
