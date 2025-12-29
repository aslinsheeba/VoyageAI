export default function Timeline() {
  const items = [
    { time: "08:30", title: "Fushimi Inari", note: "Start early to avoid crowd" },
    { time: "11:00", title: "Kinkaku-ji", note: "Golden Pavilion photos" },
    { time: "14:30", title: "Gion Walk", note: "Tea street + old town vibe" },
    { time: "19:00", title: "Dinner", note: "Local ramen spot" },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Day 1 — Kyoto</h2>
        <p className="text-xs text-slate-400">Static itinerary (Phase 1)</p>
      </div>

      {/* Rain alert */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4">
        <p className="text-sm font-semibold text-sky-300">🌧 Rain Alert</p>
        <p className="text-xs text-slate-300 mt-1">
          Light rain expected at 3 PM. Carry an umbrella.
        </p>
      </div>

      {/* Itinerary */}
      <h3 className="text-sm font-semibold text-white mb-3">Itinerary</h3>
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="w-14 text-sky-300 text-sm font-semibold">{it.time}</div>
            <div>
              <p className="text-white text-sm font-semibold">{it.title}</p>
              <p className="text-xs text-slate-400">{it.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Budget */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-slate-300">
          <span>Budget</span>
          <span>₹5400 / ₹8000 (68%)</span>
        </div>
        <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-[68%] bg-sky-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}
