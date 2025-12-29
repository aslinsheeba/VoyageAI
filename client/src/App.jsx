import MapCanvas from "./components/MapCanvas";
import CursorOverlay from "./components/CursorOverlay";
import Timeline from "./components/Timeline";
import AIChatWidget from "./components/AIChatWidget";
import EmergencyButton from "./components/EmergencyButton";

export default function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      {/* Split Screen */}
      <div className="flex w-full h-full">
        {/* LEFT: MAP */}
        <div className="relative flex-1">
          <MapCanvas />
        </div>

        {/* RIGHT: SIDEBAR */}
        <div className="w-[380px] max-w-[40vw] h-full border-l border-white/10 bg-slate-900/60 backdrop-blur-md">
          <div className="h-full flex flex-col">
            {/* Timeline area (scrollable) */}
            <div className="flex-1 overflow-y-auto">
              <Timeline />
            </div>

            {/* Chat area (docked bottom) */}
            <div className="border-t border-white/10">
              <AIChatWidget docked />
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      <CursorOverlay />
      <EmergencyButton />

      {/* Top header on map side only */}
      <div className="absolute top-0 left-0 right-[380px] z-20 pointer-events-none p-4">
        <header className="pointer-events-auto flex items-center justify-between">
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-2xl">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Voyage<span className="text-sky-400">AI</span>
            </h1>
          </div>

          <button className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full font-medium shadow-lg transition">
            + New Trip
          </button>
        </header>
      </div>
    </div>
  );
}
