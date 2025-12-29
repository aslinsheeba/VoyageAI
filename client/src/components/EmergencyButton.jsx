import { useState } from "react"

export default function EmergencyButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* SOS BUTTON */}
      <div className="fixed bottom-5 left-5 z-[99999]">
        {/* Ripple */}
        <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />

        {/* Glow ring */}
        <span className="absolute -inset-2 rounded-full bg-red-500/30 blur-xl" />

        {/* Button */}
        <button
          onClick={() => setOpen(true)}
          className="relative w-16 h-16 rounded-full bg-red-600 text-white font-extrabold text-lg
                     shadow-[0_0_25px_rgba(239,68,68,0.9)]
                     hover:bg-red-700 active:scale-95 transition"
        >
          SOS
        </button>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative w-[360px] max-w-[92vw]
                          bg-slate-900/80 backdrop-blur-md
                          border border-white/10 rounded-2xl
                          p-5 shadow-2xl">
            <h2 className="text-white text-lg font-semibold">
              🚨 Emergency (Coming Soon)
            </h2>

            <p className="text-slate-300 text-sm mt-2">
              Emergency response, location sharing, and alerts
              will be enabled in later phases.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl
                           bg-red-600 text-white
                           hover:bg-red-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
