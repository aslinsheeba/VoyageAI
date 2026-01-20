import { useEffect, useState } from "react";
import MapCanvas from "./components/MapCanvas";
import CursorOverlay from "./components/CursorOverlay";
import Timeline from "./components/Timeline";
import AIChatWidget from "./components/AIChatWidget.jsx";
import EmergencyButton from "./components/EmergencyButton";
import NewTripModal from "./components/NewTripModal";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import { getTrips, deleteTrip } from "./api/tripsService"; // 👈 Import deleteTrip

export default function App() {
  const { user, loading } = useAuth();
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 🔄 Fetch trips
  const refreshTrips = async () => {
    if (!user?.uid) return;
    try {
      const list = await getTrips(user.uid);
      const sortedList = [...list].reverse(); 
      setTrips(sortedList);
      
      // If active trip was deleted, or no trip selected, pick the first one
      if (sortedList.length > 0) {
         if (!activeTrip || !sortedList.find(t => t._id === activeTrip._id)) {
            setActiveTrip(sortedList[0]);
         }
      } else {
        setActiveTrip(null);
      }
    } catch (err) {
      console.error("Trip fetch failed:", err);
    }
  };

  useEffect(() => {
    refreshTrips();
  }, [user]);

  // 🗑️ HANDLE DELETE
  const handleDeleteTrip = async () => {
    if (!activeTrip) return;
    if (!confirm(`Are you sure you want to delete ${activeTrip.tripName || activeTrip.city}?`)) return;

    try {
      await deleteTrip(activeTrip._id); // Call API
      // Remove from local state immediately for speed
      const updatedList = trips.filter(t => t._id !== activeTrip._id);
      setTrips(updatedList);
      
      // Select new active trip
      if (updatedList.length > 0) {
        setActiveTrip(updatedList[0]);
      } else {
        setActiveTrip(null);
      }
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  const handleTripChange = (e) => {
    const selectedId = e.target.value;
    const trip = trips.find((t) => t._id === selectedId);
    if (trip) setActiveTrip(trip);
  };

  const spent = (activeTrip?.locations || []).reduce((sum, l) => sum + Number(l.cost || 0), 0);
  const total = Number(activeTrip?.budget || 0);
  const percent = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;
  if (!user) return <Login />;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      <div className="flex w-full h-full">
        {/* LEFT — MAP */}
        <div className="relative flex-1">
          <MapCanvas key={activeTrip?._id} locations={activeTrip?.locations || []} />
        </div>

        {/* RIGHT — SIDEBAR */}
        <aside className="w-[360px] border-l border-white/10 bg-slate-900/60 backdrop-blur-md flex flex-col">
          
          {/* 🔽 TRIP SELECTOR & DELETE */}
          <div className="p-4 border-b border-white/10 bg-black/20">
            <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">
              Current Trip
            </label>
            <div className="flex gap-2">
              <select 
                className="flex-1 bg-slate-800 text-white p-2 rounded border border-slate-600 focus:outline-none focus:border-sky-500"
                value={activeTrip?._id || ""}
                onChange={handleTripChange}
              >
                {trips.length === 0 && <option>No trips saved</option>}
                {trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.tripName || trip.city} ({trip.days} days)
                  </option>
                ))}
              </select>
              
              {/* 🗑️ DELETE BUTTON */}
              <button 
                onClick={handleDeleteTrip}
                disabled={!activeTrip}
                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded border border-red-500/30 transition disabled:opacity-50"
                title="Delete this trip"
              >
                🗑️
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-400 flex justify-between">
               <span>{trips.length} trips saved</span>
               <span>{activeTrip?.city}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Timeline trip={activeTrip} spent={spent} total={total} percent={percent} />
          </div>
          <div className="border-t border-white/10">
            <AIChatWidget docked />
          </div>
        </aside>
      </div>

      <CursorOverlay />
      <EmergencyButton />

      <div className="absolute top-0 left-0 right-[360px] z-30 p-4">
        <header className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
          <h1 className="text-2xl font-bold text-white">Voyage<span className="text-sky-400">AI</span></h1>
          <button onClick={() => setModalOpen(true)} className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full font-medium shadow-lg">
            + New Trip
          </button>
        </header>
      </div>

      <NewTripModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onTripCreated={refreshTrips} />
    </div>
  );
}