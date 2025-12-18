import { useState } from "react"
import { douglasScale } from "@/data/meteorology"
import type { HeightUnit } from "@/types/meteorology"

interface DouglasViewProps {
  onBack: () => void
}

export function DouglasView({ onBack }: DouglasViewProps) {
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
        <h1 className="text-4xl font-bold text-black">Skala Douglasa</h1>
        <p className="text-gray-500 mt-2">Skala stanu morza</p>
      </div>

      <div className="px-4 space-y-6 pb-8">
        <div className="flex gap-2">
          <button
            onClick={() => setHeightUnit("m")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              heightUnit === "m" ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            Metry (M)
          </button>
          <button
            onClick={() => setHeightUnit("ft")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              heightUnit === "ft" ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            Stopy (FT)
          </button>
        </div>

        <div className="space-y-3">
          {douglasScale.map((d) => (
            <div key={d.degree} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-black">Stopień {d.degree}</h3>
                <span className="text-sm text-gray-500">{d.description}</span>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-500 text-sm mb-1">Wysokość fal</p>
                <p className="font-medium text-black">
                  {heightUnit === "m" ? `${d.heightM} m` : `${d.heightFt} ft`}
                </p>
              </div>
              
              <p className="text-sm text-gray-600">{d.characteristics}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}