import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next"

interface PassagePlanDesktopButtonsProps {
  segmentsCount: number;
  tempRoutePointsCount: number;
  onUndoLastSegment: () => void;
  onClearAllSegments: () => void;
}

export function PassagePlanDesktopButtons({
  segmentsCount,
  tempRoutePointsCount,
  onUndoLastSegment,
  onClearAllSegments,
}: PassagePlanDesktopButtonsProps) {
  const { t } = useTranslation()

  return (
    <div className="hidden md:flex flex-col items-center gap-3 absolute left-1/2 bottom-10 -translate-x-1/2 z-50">
      {tempRoutePointsCount > 0 && (
        <div className="bg-slate-900/90 text-white px-4 py-2 rounded-lg text-sm">
          {tempRoutePointsCount >= 2 ? (
            <span>
              ✓ {t("Press Enter to add a stop or continue clicking")}
            </span>
          ) : (
            <span>
              {t("Click to add points • Esc cancels")}
            </span>
          )}
        </div>
      )}

      {segmentsCount > 0 && tempRoutePointsCount === 0 && (
        <div className="flex gap-2">
          <Button onClick={onUndoLastSegment} variant="secondary">
            {t("Undo last")}
          </Button>
          <Button onClick={onClearAllSegments} variant="destructive">
            {t("Clear all")}
          </Button>
        </div>
      )}
    </div>
  )
}
