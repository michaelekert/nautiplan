import { useState, useEffect } from "react"

interface AnimatedCircleProps {
  percentage: number
}

export function AnimatedCircle({ percentage }: AnimatedCircleProps) {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const circleColor = percentage >= 80 ? "#22c55e" : "#ef4444"
  const [animatedPercent, setAnimatedPercent] = useState(0)
  const [animatedOffset, setAnimatedOffset] = useState(circumference)

  useEffect(() => {
    let start: number | null = null
    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / 1500, 1)
      setAnimatedPercent(Math.round(progress * percentage))
      setAnimatedOffset(circumference - (progress * percentage) / 100 * circumference)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [percentage, circumference])

  return (
    <div className="relative w-[150px] h-[150px] mb-4">
      <svg width={150} height={150}>
        <circle 
          cx={75} 
          cy={75} 
          r={radius} 
          stroke="#e5e7eb" 
          strokeWidth={12} 
          fill="transparent" 
        />
        <circle
          cx={75}
          cy={75}
          r={radius}
          stroke={circleColor}
          strokeWidth={12}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          transform="rotate(-90 75 75)"
        />
      </svg>
      <div 
        className="absolute inset-0 flex items-center justify-center text-2xl font-bold" 
        style={{ color: circleColor }}
      >
        {animatedPercent}%
      </div>
    </div>
  )
}