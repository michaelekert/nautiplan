import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface BeaufortCardProps {
  force: number;
  description: string;
  windKt: string;
  windMph: number;
  windKmh: number;
  wavesM: number;
  wavesFt: number;
}

const beaufortScale: BeaufortCardProps[] = [
  { force: 0, description: "Calm", windKt: "<1", windMph: 1, windKmh: 1, wavesM: 0, wavesFt: 0 },
  { force: 1, description: "Light air", windKt: "1-3", windMph: 4, windKmh: 6, wavesM: 0.1, wavesFt: 0.3 },
  { force: 2, description: "Light breeze", windKt: "4-6", windMph: 7, windKmh: 11, wavesM: 0.2, wavesFt: 0.6 },
  { force: 3, description: "Gentle breeze", windKt: "7-10", windMph: 12, windKmh: 19, wavesM: 0.6, wavesFt: 2 },
  { force: 4, description: "Moderate breeze", windKt: "11-16", windMph: 18, windKmh: 29, wavesM: 1.2, wavesFt: 4 },
  { force: 5, description: "Fresh breeze", windKt: "17-21", windMph: 24, windKmh: 39, wavesM: 2, wavesFt: 6.5 },
  { force: 6, description: "Strong breeze", windKt: "22-27", windMph: 31, windKmh: 50, wavesM: 3, wavesFt: 10 },
  { force: 7, description: "Near gale", windKt: "28-33", windMph: 38, windKmh: 61, wavesM: 4, wavesFt: 13 },
  { force: 8, description: "Gale", windKt: "34-40", windMph: 46, windKmh: 74, wavesM: 5.5, wavesFt: 18 },
  { force: 9, description: "Severe gale", windKt: "41-47", windMph: 54, windKmh: 87, wavesM: 7, wavesFt: 23 },
  { force: 10, description: "Storm", windKt: "48-55", windMph: 63, windKmh: 101, wavesM: 9, wavesFt: 30 },
  { force: 11, description: "Violent storm", windKt: "56-63", windMph: 72, windKmh: 117, wavesM: 12, wavesFt: 39 },
  { force: 12, description: "Hurricane", windKt: "64 <", windMph: 83, windKmh: 133, wavesM: 14, wavesFt: 46 },
];

export const NauticalDictionarySection = () => {
  const [view, setView] = useState<"home" | "signals" | "beaufort">("home");
  const [speedUnit, setSpeedUnit] = useState<"kt" | "mph" | "kmh">("kt");
  const [heightUnit, setHeightUnit] = useState<"m" | "ft">("m");

  if (view === "home") {
    return (
      <div className="min-h-screen">
        <div className="px-6 pt-12 pb-6">
          <h1 className="text-xl font-bold text-black">Meteorologia</h1>
        </div>

        <div className="px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <button 
              onClick={() => setView("signals")}
              className="w-full px-4 py-3 flex items-center justify-between active:bg-gray-100 transition-colors  cursor-pointer"
            >
              <span className="text-base text-black">Sygnały dźwiękowe</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="h-px bg-gray-200 mx-4" />
            
            <button 
              onClick={() => setView("beaufort")}
              className="w-full px-4 py-3 flex items-center justify-between active:bg-gray-100 transition-colors  cursor-pointer"
            >
              <span className="text-base text-black">Skala Beauforta</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "signals") {
    return (
      <div className="min-h-screen ">
        <div className="px-6 pt-12 pb-6">
          <button 
            onClick={() => setView("home")}
            className="text-blue-500 text-lg mb-2"
          >
           Wstecz
          </button>
          <h1 className="text-4xl font-bold text-black">Sygnały dźwiękowe</h1>
        </div>

        <div className="px-4">
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
    );
  }

  if (view === "beaufort") {
    return (
      <div className="min-h-screen">
        <div className="px-6 pt-12 pb-6">
          <button 
            onClick={() => setView("home")}
            className=" text-lg mb-2 cursor-pointer"
          >
            Wstecz
          </button>
          <h1 className="text-4xl font-bold text-black">Skala Beauforta</h1>
        </div>

        <div className="px-4 space-y-6">
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
                
                {b.force === 0 && (
                  <p className="mt-3 text-sm text-gray-500">Sea like a mirror</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}