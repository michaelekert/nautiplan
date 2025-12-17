import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { initialSignals } from "@/data/signals"

export function RegulationsSection() {
  return (
    <div className="space-y-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="mks"
          className="!border !border-solid rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <span className="text-2xl">🚩</span>
              <div>
                <h3 className="font-semibold text-black">Międzynarodowy Kod Sygnałowy (MKS)</h3>
              </div>
            </div>
          </AccordionTrigger>
          
          <AccordionContent className="px-4 pb-4">
            <Accordion type="single" collapsible className="w-full space-y-2 mt-5">
              {initialSignals.map((signal) => (
                <AccordionItem
                  key={signal.letter}
                  value={signal.letter}
                  className="!border !border-solid !border-gray-200 rounded-lg overflow-hidden bg-white"
                >
                  <div className="flex items-center gap-3 text-left w-full p-4 bg-slate-100">
                    <div className="flex items-center justify-center w-15 h-15 text-white rounded-lg font-bold text-xl shrink-0">
                      {signal.flag && (
                        <img 
                          src={signal.flag} 
                          alt={signal.letter} 
                          className="w-20 h-8" 
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{signal.name}</div>
                      <div className="text-sm text-gray-600 truncate">
                        <span className="font-semibold">Znaczenie:</span> {signal.meaning}
                      </div>
                    </div>
                    <div className="text-2xl shrink-0">
                      {signal.letter}
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}