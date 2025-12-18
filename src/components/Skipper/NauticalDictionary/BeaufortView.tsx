import { useState } from "react"
import { beaufortScale } from "@/data/Skipper/meteorology"
import type { SpeedUnit, HeightUnit } from "@/types/Skipper/meteorology"

interface BeaufortViewProps {
  onBack: () => void
}

export function BeaufortView({ onBack }: BeaufortViewProps) {
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>("kt")
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("m")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-12 pb-6">
        <button 
          onClick={onBack}
          className="text-blue-500 text-lg mb-2 cursor-pointer"
        >
          ← Wstecz
        </button>
        <h1 className="text-4xl font-bold text-black">Skala Beauforta</h1>
      </div>

      <div className="px-4 space-y-6 pb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold mb-2 text-gray-500">Prędkość wiatru</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSpeedUnit("kt")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  speedUnit === "kt" ? "bg-slate-600 text-white" : "bg-white text-black"
                }`}
              >
                KT
              </button>
              <button
                onClick={() => setSpeedUnit("mph")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  speedUnit === "mph" ? "bg-slate-600 text-white" : "bg-white text-black"
                }`}
              >
                MPH
              </button>
              <button
                onClick={() => setSpeedUnit("kmh")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  speedUnit === "kmh" ? "bg-slate-600 text-white" : "bg-white text-black"
                }`}
              >
                KM/H
              </button>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold mb-2 text-gray-500">Wysokość fal</p>
            <div className="flex gap-2">
              <button
                onClick={() => setHeightUnit("m")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  heightUnit === "m" ? "bg-slate-600 text-white" : "bg-white text-black"
                }`}
              >
                M
              </button>
              <button
                onClick={() => setHeightUnit("ft")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  heightUnit === "ft" ? "bg-slate-600 text-white" : "bg-white text-black"
                }`}
              >
                FT
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {beaufortScale.map((b) => (
            <div key={b.force} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-black">Force {b.force}</h3>
                <span className="text-gray-500">{b.description}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Wind</p>
                  <p className="font-medium text-black">
                    {speedUnit === "kt"
                      ? `${b.windKt} kt`
                      : speedUnit === "mph"
                      ? `${b.windMph} mph`
                      : `${b.windKmh} km/h`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Waves</p>
                  <p className="font-medium text-black">
                    {heightUnit === "m"
                      ? `${b.wavesM} m`
                      : `${b.wavesFt} ft`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}