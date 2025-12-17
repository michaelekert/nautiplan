import { weatherFronts } from "@/data/meteorology"

interface FrontsViewProps {
  onBack: () => void
}

export function FrontsView({ onBack }: FrontsViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-12 pb-6">
        <button 
          onClick={onBack}
          className="text-blue-500 text-lg mb-2 cursor-pointer"
        >
          ← Wstecz
        </button>
        <h1 className="text-4xl font-bold text-black">Fronty atmosferyczne</h1>
        <p className="text-gray-500 mt-2">Rodzaje i charakterystyka</p>
      </div>

      <div className="px-4 space-y-4 pb-8">
        {weatherFronts.map((front, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-black">{front.type}</h3>
              <span className="text-2xl text-blue-500">{front.symbol}</span>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">{front.description}</p>
            
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Charakterystyka:</p>
                <ul className="space-y-1">
                  {front.characteristics.map((char, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <p className="text-gray-500 text-sm">Pogoda</p>
                <p className="text-black font-medium">{front.weather}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}