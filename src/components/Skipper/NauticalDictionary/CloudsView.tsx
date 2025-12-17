import { Cloud } from "lucide-react"
import { cloudTypes } from "@/data/meteorology"

interface CloudsViewProps {
  onBack: () => void
}

export function CloudsView({ onBack }: CloudsViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-12 pb-6">
        <button 
          onClick={onBack}
          className="text-blue-500 text-lg mb-2 cursor-pointer"
        >
          ← Wstecz
        </button>
        <h1 className="text-4xl font-bold text-black">Chmury</h1>
        <p className="text-gray-500 mt-2">Rodzaje i charakterystyka</p>
      </div>

      <div className="px-4 space-y-3 pb-8">
        {cloudTypes.map((cloud, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <Cloud className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black">{cloud.name}</h3>
                <p className="text-sm text-gray-500 italic">{cloud.latinName}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Wysokość</p>
                <p className="text-black font-medium">{cloud.altitude}</p>
              </div>
              
              <div>
                <p className="text-gray-500">Charakterystyka</p>
                <p className="text-black">{cloud.description}</p>
              </div>
              
              <div>
                <p className="text-gray-500">Pogoda</p>
                <p className="text-black">{cloud.weather}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}