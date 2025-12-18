interface SignalsViewProps {
  onBack: () => void
}

export function SignalsView({ onBack }: SignalsViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-12 pb-6">
        <button 
          onClick={onBack}
          className="text-blue-500 text-lg mb-2 cursor-pointer"
        >
          ← Wstecz
        </button>
        <h1 className="text-4xl font-bold text-black">Sygnały dźwiękowe</h1>
      </div>

      <div className="px-4 pb-8">
        <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <p className="text-lg font-semibold mb-2 text-black">Signal Key – Znaczenie sygnałów</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium text-black">1 short blast</p>
              <p className="text-gray-500 text-sm">Zmieniam kurs w prawo</p>
            </div>
            
            <div>
              <p className="font-medium text-black">2 short blasts</p>
              <p className="text-gray-500 text-sm">Zmieniam kurs w lewo</p>
            </div>
            
            <div>
              <p className="font-medium text-black">3 short blasts</p>
              <p className="text-gray-500 text-sm">Pracuję wstecz</p>
            </div>
            
            <div>
              <p className="font-medium text-black">5 short blasts</p>
              <p className="text-gray-500 text-sm">Sygnał ostrzegawczy (wątpliwość co do intencji)</p>
            </div>
            
            <div>
              <p className="font-medium text-black">1 prolonged blast</p>
              <p className="text-gray-500 text-sm">Wychodzę z portu lub opuszczam miejsce cumowania</p>
            </div>
            
            <div>
              <p className="font-medium text-black">1 prolonged + 1 short</p>
              <p className="text-gray-500 text-sm">Zamierzam wyprzedzić po lewej burcie</p>
            </div>
            
            <div>
              <p className="font-medium text-black">1 prolonged + 2 short</p>
              <p className="text-gray-500 text-sm">Zamierzam wyprzedzić po prawej burcie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}