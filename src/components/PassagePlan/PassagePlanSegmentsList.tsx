import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Segment } from "../../types/passagePlan";

interface PassagePlanSegmentsListProps {
  segments: Segment[];
  onSpeedChange: (id: string, speed: number) => void;
  onStopChange: (id: string, stop: number) => void;
  onNameChange: (id: string, field: "startName" | "endName", value: string) => void;
}

export function PassagePlanSegmentsList({
  segments,
  onSpeedChange,
  onStopChange,
  onNameChange,
}: PassagePlanSegmentsListProps) {
  if (segments.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-4">
        ✏️ Kliknij „Rysuj trasę", aby rozpocząć planowanie trasy.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {segments.map((s) => (
        <li
          key={s.id}
          className="p-4 bg-slate-700 rounded-lg flex flex-col gap-3 shadow-md"
        >
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              value={s.startName}
              onChange={(e) => onNameChange(s.id, "startName", e.target.value)}
              className="rounded-lg border border-slate-600 bg-slate-900 text-white w-full"
            />
            <span>→</span>
            <Input
              type="text"
              value={s.endName}
              onChange={(e) => onNameChange(s.id, "endName", e.target.value)}
              className="rounded-lg border border-slate-600 bg-slate-900 text-white w-full"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col">
              <Label className="text-slate-200 text-sm">Prędkość (węzły)</Label>
              <Input
                type="number"
                min={0.1}
                step={0.1}
                value={s.speed}
                onChange={(e) => onSpeedChange(s.id, Number(e.target.value))}
                className="rounded-lg border border-slate-600 bg-slate-900 text-white"
              />
            </div>

            <div className="flex flex-col">
              <Label className="text-slate-200 text-sm">Postój (h)</Label>
              <Input
                type="number"
                min={0}
                step={0.1}
                value={s.stopHours}
                onChange={(e) => onStopChange(s.id, Number(e.target.value))}
                className="rounded-lg border border-slate-600 bg-slate-900 text-white"
              />
            </div>

            <div className="col-span-2 flex flex-col justify-end">
              <Label className="text-slate-200 text-sm mb-1">
                Przewidywany czas dopłynięcia
              </Label>
              <div className="text-slate-300 text-sm">
                {s.arrivalTime.toLocaleString()}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}