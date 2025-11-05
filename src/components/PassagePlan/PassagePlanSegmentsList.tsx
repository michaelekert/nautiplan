import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next"
import type { Segment } from "../../types/passagePlan";

interface PassagePlanSegmentsListProps {
  segments: Segment[];
  onSpeedChange: (id: string, speed: number) => void;
  onStopChange: (id: string, stop: number) => void;
  onNameChange: (
    id: string,
    field: "startName" | "endName",
    value: string
  ) => void;
}

export function PassagePlanSegmentsList({
  segments,
  onSpeedChange,
  onStopChange,
  onNameChange,
}: PassagePlanSegmentsListProps) {
  const { t } = useTranslation()

  if (segments.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-4">
        ✏️ {t("Click on the map to add a route.")}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {segments.map((s) => {
        const durationHours =
          s.speed > 0 ? (s.distanceNm / s.speed).toFixed(2) : null;

        return (
          <li
            key={s.id}
            className="p-4 bg-slate-700 rounded-lg flex flex-col gap-4 shadow-md"
          >
            <div className="flex items-center justify-between w-full gap-3">
              <Input
                type="text"
                value={s.startName}
                onChange={(e) => onNameChange(s.id, "startName", e.target.value)}
                className="rounded-lg border border-slate-600 bg-slate-900 text-white w-full"
                placeholder={t("Start point")}
              />

              <div className="flex flex-col items-center w-[180px]">
                <div className="text-[13px] text-slate-400 mb-1 font-mono text-center whitespace-nowrap">
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
                onChange={(e) => onNameChange(s.id, "endName", e.target.value)}
                className="rounded-lg border border-slate-600 bg-slate-900 text-white w-full"
                placeholder={t("End point")}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
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
                <Label className="text-slate-200 text-sm">{t("Stop (hours)")}</Label>
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

              <div className="col-span-2 flex flex-col justify-end">
                <Label className="text-slate-200 text-sm mb-1">
                  {t("Estimated arrival time")}
                </Label>
                <div className="text-slate-300 text-sm">
                  {s.arrivalTime.toLocaleString()}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
