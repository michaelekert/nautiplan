import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Segment } from "../../types/passagePlan";

interface PassagePlanMobileDrawerProps {
  startDate: string;
  defaultSpeed: number;
  segments: Segment[];
  onStartDateChange: (value: string) => void;
  onDefaultSpeedChange: (value: number) => void;
  onSpeedChange: (id: string, speed: number) => void;
  onStopChange: (id: string, stop: number) => void;
  onNameChange: (id: string, field: "startName" | "endName", value: string) => void;
}

export function PassagePlanMobileDrawer({
  startDate,
  defaultSpeed,
  segments,
  onStartDateChange,
  onDefaultSpeedChange,
  onSpeedChange,
  onStopChange,
  onNameChange,
}: PassagePlanMobileDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger
        className="md:hidden fixed left-1/2 bottom-1/6 -translate-x-1/2 z-50"
        asChild
      >
        <Button className="w-1/2">Otwórz Panel Planowania</Button>
      </DrawerTrigger>

      <DrawerContent className="md:hidden w-full h-[80dvh] max-w-full bg-slate-800 text-white p-0 flex flex-col">
        <DrawerHeader className="p-6">
          <DrawerTitle className="text-white">⚓ Ustawienia trasy</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <Label htmlFor="startDate" className="mb-2">
                📅 Data i godzina wypłynięcia
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full h-10 px-2 rounded-lg border border-slate-600 bg-slate-900 text-white appearance-none"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="defaultSpeed" className="mb-2">
                ⚓ Domyślna prędkość (KN)
              </Label>
              <Input
                id="defaultSpeed"
                type="number"
                min={0.1}
                step={0.1}
                value={defaultSpeed}
                onChange={(e) => onDefaultSpeedChange(Number(e.target.value))}
                className="w-full h-10 px-2 rounded-lg border border-slate-600 bg-slate-900 text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {segments.map((s) => (
              <div key={s.id} className="p-3 bg-slate-700 rounded-lg flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    value={s.startName}
                    onChange={(e) => onNameChange(s.id, "startName", e.target.value)}
                    className="flex-1 rounded-lg border border-slate-600 bg-slate-900 text-white"
                  />
                  <span>→</span>
                  <Input
                    type="text"
                    value={s.endName}
                    onChange={(e) => onNameChange(s.id, "endName", e.target.value)}
                    className="flex-1 rounded-lg border border-slate-600 bg-slate-900 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
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
                </div>

                <div className="text-sm text-slate-300">
                  Przewidywany czas dopłynięcia: {s.arrivalTime.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}