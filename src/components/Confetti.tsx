import { useEffect, useState } from "react"

const COLORS = ["#22c55e", "#3b82f6", "#fbbf24", "#ef4444", "#a855f7"]

export function Confetti({ count = 150 }) {
  const [pieces, setPieces] = useState<
    { id: number; left: number; size: number; color: string; delay: number }[]
  >([])

  useEffect(() => {
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2,
    }))
    setPieces(generated)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map(({ id, left, size, color, delay }) => (
        <div
          key={id}
          className="absolute animate-fall opacity-80"
          style={{
            left: `${left}%`,
            top: `-${size}px`,
            width: `${size}px`,
            height: `${size * 0.6}px`,
            backgroundColor: color,
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  )
}
