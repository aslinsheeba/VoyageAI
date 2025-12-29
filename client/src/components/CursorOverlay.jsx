import { useEffect, useState } from "react"

export default function CursorOverlay() {
  const [alex, setAlex] = useState({ x: 120, y: 160 })
  const [sam, setSam] = useState({ x: 260, y: 220 })

  useEffect(() => {
    const id = setInterval(() => {
      setAlex((p) => ({ x: p.x + (Math.random() * 20 - 10), y: p.y + (Math.random() * 20 - 10) }))
      setSam((p) => ({ x: p.x + (Math.random() * 20 - 10), y: p.y + (Math.random() * 20 - 10) }))
    }, 700)

    return () => clearInterval(id)
  }, [])

  const Cursor = ({ name, pos }) => (
    <div
      className="absolute pointer-events-none"
      style={{
        left: pos.x,
        top: pos.y,
        transition: "all 0.2s ease",
      }}
    >
      <div className="text-white text-xs bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1 rounded-full">
        {name}
      </div>
      <div className="w-3 h-3 rotate-45 bg-sky-400 mt-1 ml-2" />
    </div>
  )

  return (
  <div className="absolute inset-0 z-[9999] pointer-events-none">
    <Cursor name="Alex" pos={alex} />
    <Cursor name="Sam" pos={sam} />
  </div>
)

}
