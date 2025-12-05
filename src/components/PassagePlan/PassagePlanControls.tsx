import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"

interface PassagePlanControlsProps {
  startDate: string
  defaultSpeed: number
  defaultStopHours: number
  segmentsCount: number
  showRouteActions: boolean
  isDrawingMode: boolean
  onStartDateChange: (value: string) => void
  onDefaultSpeedChange: (value: number) => void
  onDefaultStopHoursChange: (value: number) => void
  onStartRouteDrawing: () => void
  onStartDrawing: () => void
  onFinishDrawing: () => void
  onCancelDrawing: () => void
  onUndoLastSegment: () => void
  onClearAllSegments: () => void
}

export function PassagePlanControls({
  startDate,
  defaultSpeed,
  defaultStopHours,
  onStartDateChange,
  onDefaultSpeedChange,
  onDefaultStopHoursChange,
}: PassagePlanControlsProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
      <div className="flex flex-col">
        <Label htmlFor="startDate" className="mb-1 font-medium text-slate-200">
          📅 {t("Departure date and time")}
        </Label>
        <Input
          id="startDate"
          type="datetime-local"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-900 text-white"
        />
      </div>

      <div className="flex flex-col">
        <Label htmlFor="defaultSpeed" className="mb-1 font-medium text-slate-200">
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
          className="rounded-lg border border-slate-600 bg-slate-900 text-white w-1/2"
        />
      </div>

      <div className="flex flex-col">
        <Label htmlFor="defaultStopHours" className="mb-1 font-medium text-slate-200">
          ⏱️ {t("Default stop time (hours)")}
        </Label>
        <Input
          id="defaultStopHours"
          type="number"
          min={0}
          step={0.5}
          value={defaultStopHours}
          onChange={(e) => {
            const val = e.target.value
            onDefaultStopHoursChange(val === "" ? 0 : Number(val))
          }}
          className="rounded-lg border border-slate-600 bg-slate-900 text-white w-1/2"
        />
      </div>
    </div>
  )
}