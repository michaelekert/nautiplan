import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Wind, Route } from "lucide-react";

interface PassagePlanDesktopButtonsProps {
  isWindPreviewMode: boolean;
  isDrawingMode: boolean;
  segmentsCount: number;
  tempRoutePointsCount: number;
  onStartRouteDrawing: () => void;
  onEnableWindPreview: () => void;
  onUndoLastSegment: () => void;
  onClearAllSegments: () => void;
}

export function PassagePlanDesktopButtons({
  isWindPreviewMode,
  isDrawingMode,
  segmentsCount,
  tempRoutePointsCount,
  onStartRouteDrawing,
  onEnableWindPreview,
}: PassagePlanDesktopButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:flex flex-col items-center gap-3 absolute left-1/2 bottom-30 -translate-x-1/2 z-50">
      {isWindPreviewMode && (
        <Button 
          onClick={onStartRouteDrawing} 
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-base font-semibold flex items-center gap-2"
        >
          <Route className="w-5 h-5" />
          {t("Draw route")}
        </Button>
      )}

      {!isWindPreviewMode && isDrawingMode && tempRoutePointsCount > 0 && (
        <div className="bg-slate-900/90 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          {tempRoutePointsCount >= 2 ? (
            <span>
              ✓ {t("Press Enter to finish segment and continue • Esc to exit • Backspace to undo last route")}
            </span>
          ) : (
            <span>
              {t("Click to add points • Esc to exit")}
            </span>
          )}
        </div>
      )}

      {!isWindPreviewMode && segmentsCount >= 0 && !isDrawingMode && (
        <div className="flex gap-2">
          <Button 
            onClick={onStartRouteDrawing} 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Route className="w-4 h-4" />
            {t("Continue route")}
          </Button>
          <Button 
            onClick={onEnableWindPreview} 
            className="bg-slate-600 hover:bg-slate-700 flex items-center gap-2"
          >
            <Wind className="w-4 h-4" />
            {t("Wind preview")}
          </Button>
        </div>
      )}
    </div>
  );
}