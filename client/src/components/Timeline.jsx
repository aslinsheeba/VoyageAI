import { useState } from "react";
import { createPortal } from "react-dom";

// --- UPDATED: Image Popup with Fallback ---
function ImageModal({ src, alt, onClose }) {
  const [imgError, setImgError] = useState(false); // Track if image failed

  if (!src) return null;

  // Fallback image (Generic Travel)
  const fallbackImage = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop";

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose} // Close when clicking outside
    >
      <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition z-10"
        >
          ✕
        </button>
        
        <img 
          src={imgError ? fallbackImage : src} 
          alt={alt} 
          className="w-full h-[60vh] object-cover"
          onError={() => setImgError(true)} // 👈 If URL fails, switch to backup
        />
        
        <div className="p-4 bg-slate-900">
          <h3 className="text-xl font-bold text-white">{alt}</h3>
          <p className="text-sm text-gray-400">
            {imgError ? "Preview Unavailable (Showing Generic)" : "AI Generated Preview"}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- MAIN TIMELINE COMPONENT ---
export default function Timeline({ trip, spent, total, percent }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!trip) {
    return <div className="p-8 text-center text-gray-500">Select a trip to view plan</div>;
  }

  const openModal = (image, name) => setSelectedImage({ src: image, alt: name });
  const closeModal = () => setSelectedImage(null);

  // --- BUDGET BAR ---
  const BudgetBar = () => (
    <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-white/5">
      <div className="flex justify-between text-sm text-gray-300 mb-2">
        <span>Est. Cost</span>
        <span className={spent > total ? "text-red-400" : "text-emerald-400"}>
          ₹{spent} / ₹{total}
        </span>
      </div>
      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${spent > total ? "bg-red-500" : "bg-emerald-500"}`} 
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );

  // --- RENDER ---
  if (trip.itinerary && trip.itinerary.length > 0) {
    return (
      <>
        {/* 1. The Popup Modal (Hidden by default) */}
        <ImageModal 
          src={selectedImage?.src} 
          alt={selectedImage?.alt} 
          onClose={closeModal} 
        />

        {/* 2. The Timeline List */}
        <div className="p-4 pb-20">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-1">{trip.city} Trip</h2>
            <p className="text-gray-400 text-sm">{trip.days} Days • {trip.members} Travelers</p>
          </div>

          <BudgetBar />

          <div className="space-y-8">
            {trip.itinerary.map((dayItem) => (
              <div key={dayItem.day} className="relative pl-6 border-l-2 border-sky-500/30">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sky-500 border-4 border-slate-900" />
                <h3 className="text-xl font-bold text-white mb-4">Day {dayItem.day}</h3>

                <div className="space-y-3">
                  {/* Activities */}
                  {dayItem.activities.map((act, i) => (
                    <div 
                      key={i} 
                      onClick={() => openModal(act.image, act.name)}
                      className="bg-slate-800 p-3 rounded-lg border border-white/5 hover:border-sky-500/50 hover:bg-slate-700 transition flex justify-between items-center cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{act.type === 'food' ? '🍔' : '📸'}</span>
                        <div>
                          <h4 className="font-medium text-gray-200 group-hover:text-sky-400 transition">{act.name}</h4>
                          <span className="text-xs text-sky-400 uppercase tracking-wider">{act.type}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">₹{act.cost}</span>
                    </div>
                  ))}
                  
                  {/* Hotel */}
                  {dayItem.hotel && (
                    <div 
                      onClick={() => openModal(dayItem.hotel.image, dayItem.hotel.name)}
                      className="bg-slate-800/50 p-3 rounded-lg border border-indigo-500/30 hover:border-indigo-400 hover:bg-slate-800/80 transition flex justify-between items-center cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🌙</span>
                        <div>
                          <h4 className="font-medium text-gray-300 group-hover:text-indigo-300 transition">Night: {dayItem.hotel.name}</h4>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">₹{dayItem.hotel.cost}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return <div className="p-4 text-gray-400">Loading plan...</div>;
}