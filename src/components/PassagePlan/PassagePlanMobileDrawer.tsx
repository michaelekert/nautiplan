import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"
import type { Segment } from "../../types/passagePlan"

interface PassagePlanMobileDrawerProps {
  startDate: string
  defaultSpeed: number
  segments: Segment[]
  onStartDateChange: (value: string) => void
  onDefaultSpeedChange: (value: number) => void
  onSpeedChange: (id: string, speed: number) => void
  onStopChange: (id: string, stop: number) => void
  onNameChange: (
    id: string,
    field: "startName" | "endName",
    value: string
  ) => void
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
  const { t } = useTranslation()

  return (
    <Drawer>
      <DrawerTrigger
        className="md:hidden fixed left-1/2 bottom-1/6 -translate-x-1/2 z-50"
        asChild
      >
        <Button className="w-1/2">{t("Open planning panel")}</Button>
      </DrawerTrigger>

      <DrawerContent className="md:hidden w-full h-[80dvh] max-w-full bg-slate-800 text-white p-0 flex flex-col">
        <DrawerHeader className="p-6">
          <DrawerTitle className="text-white">⚓ {t("Route settings")}</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <Label htmlFor="startDate" className="mb-2">
                📅 {t("Departure date and time")}
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
                ⚓ {t("Default speed (knots)")}
              </Label>
              <Input
                id="defaultSpeed"
                type="number"
                min={0.1}
                step={0.1}
                value={defaultSpeed}
                onChange={(e) => {
                  const val = e.target.value
                  onDefaultSpeedChange(val === "" ? NaN : Number(val))
                }}
                className="w-full h-10 px-2 rounded-lg border border-slate-600 bg-slate-900 text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {segments.map((s) => {
              const durationHours =
                s.speed > 0 ? (s.distanceNm / s.speed).toFixed(2) : null

              return (
                <div
                  key={s.id}
                  className="p-3 bg-slate-700 rounded-lg flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between w-full gap-3">
                    <Input
                      type="text"
                      value={s.startName}
                      onChange={(e) =>
                        onNameChange(s.id, "startName", e.target.value)
                      }
                      className="rounded-lg border border-slate-600 bg-slate-900 text-white w-full"
                      placeholder={t("Start point")}
                    />

                    <div className="flex flex-col items-center w-[150px]">
                      <div className="text-[11px] text-slate-400 mb-1 font-mono text-center whitespace-nowrap">
                        {s.distanceNm ? (
                          <>
                            {s.distanceNm.toFixed(1)} NM{" "}
                            {durationHours && <>• {durationHours} h</>}
                          </>
                        ) : (
                          "— NM"
                        )}
                      </div>

                      <div className="relative w-full flex items-center justify-center">
                        <div className="h-[2px] bg-slate-500 w-full relative">
                          <div className="absolute right-0 -top-[4px] border-t-[5px] border-t-transparent border-l-[8px] border-l-slate-400 border-b-[5px] border-b-transparent"></div>
                        </div>
                      </div>
                    </div>

                    <Input
                      type="text"
                      value={s.endName}
                      onChange={(e) =>
                        onNameChange(s.id, "endName", e.target.value)
                      }
                      className="rounded-lg border border-slate-600 bg-slate-900 text-white w-full"
                      placeholder={t("End point")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div className="flex flex-col">
                      <Label className="text-slate-200 text-sm">
                        {t("Speed (knots)")}
                      </Label>
                      <Input
                        type="number"
                        value={s.speed}
                        onChange={(e) => {
                          const val = e.target.value
                          onSpeedChange(s.id, val === "" ? NaN : Number(val))
                        }}
                        className="rounded-lg border border-slate-600 bg-slate-900 text-white"
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label className="text-slate-200 text-sm">
                        {t("Stop (hours)")}
                      </Label>
                      <Input
                        type="number"
                        value={s.stopHours}
                        onChange={(e) => {
                          const val = e.target.value
                          onStopChange(s.id, val === "" ? NaN : Number(val))
                        }}
                        className="rounded-lg border border-slate-600 bg-slate-900 text-white"
                      />
                    </div>
                  </div>

                  <div className="text-sm text-slate-300">
                    {t("Estimated arrival time")}: {s.arrivalTime.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
