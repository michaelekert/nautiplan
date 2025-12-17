import { useState } from "react"
import { ChevronRight, Cloud, Waves, Wind } from "lucide-react"
import { SignalsView } from "./NauticalDictionary/SignalsView"
import { BeaufortView } from "./NauticalDictionary/BeaufortView"
import { DouglasView } from "./NauticalDictionary/DouglasView"
import { CloudsView } from "./NauticalDictionary/CloudsView"
import { FrontsView } from "./NauticalDictionary/FrontsView"

type View = "home" | "signals" | "beaufort" | "douglas" | "clouds" | "fronts"

export function NauticalDictionarySection() {
  const [view, setView] = useState<View>("home")

  const goHome = () => setView("home")

  if (view === "signals") return <SignalsView onBack={goHome} />
  if (view === "beaufort") return <BeaufortView onBack={goHome} />
  if (view === "douglas") return <DouglasView onBack={goHome} />
  if (view === "clouds") return <CloudsView onBack={goHome} />
  if (view === "fronts") return <FrontsView onBack={goHome} />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-xl font-bold text-black">Meteorologia</h1>
      </div>

      <div className="px-4 space-y-3">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => setView("signals")}
            className="w-full px-4 py-3 flex items-center justify-between active:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="text-base text-black">Sygnały dźwiękowe</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="h-px bg-gray-200 mx-4" />
          
          <button 
            onClick={() => setView("beaufort")}
            className="w-full px-4 py-3 flex items-center justify-between active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-blue-500" />
              <span className="text-base text-black">Skala Beauforta</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="h-px bg-gray-200 mx-4" />
          
          <button 
            onClick={() => setView("douglas")}
            className="w-full px-4 py-3 flex items-center justify-between active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Waves className="w-5 h-5 text-blue-500" />
              <span className="text-base text-black">Skala morska Douglasa</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="h-px bg-gray-200 mx-4" />
          
          <button 
            onClick={() => setView("clouds")}
            className="w-full px-4 py-3 flex items-center justify-between active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-gray-500" />
              <span className="text-base text-black">Chmury</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="h-px bg-gray-200 mx-4" />
          
          <button 
            onClick={() => setView("fronts")}
            className="w-full px-4 py-3 flex items-center justify-between active:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="text-base text-black">Fronty atmosferyczne</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}