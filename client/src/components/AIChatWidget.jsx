import { useState } from "react";

export default function AIChatWidget() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "I’m VoyageAI. I’ll assist you throughout today’s plan ✨",
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setThinking(true);

    // UI-only simulated response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Noted 👍 I’ll keep this in mind for your itinerary.",
        },
      ]);
      setThinking(false);
    }, 1200);
  };

  return (
    <section className="mt-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-lg flex flex-col h-[280px]">

      {/* Header */}
      <div className="px-4 py-2 text-sm font-semibold text-white border-b border-white/10">
        🤖 AI Travel Assistant
        <span className="ml-2 text-xs text-white/50">(Glass UI)</span>
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
          placeholder="Ask about today’s plan..."
          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none placeholder-white/40"
        />

        <button
          onClick={sendMessage}
          className="px-4 rounded-xl bg-sky-500/80 hover:bg-sky-500 text-white text-sm transition"
        >
          Send
        </button>
      </div>
    </section>
  );
}
