import { Button } from "@/components/ui/button";
import { PlusCircle, Flag, XCircle, CornerUpLeft, Wind, Route } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PassagePlanMobileButtonsProps {
  isWindPreviewMode: boolean;
  showRouteActions: boolean;
  segmentsCount: number;
  tempRoutePointsCount: number;
  onStartRouteDrawing: () => void;
  onEnableWindPreview: () => void;
  onAddPointAtCenter: () => void;
  onFinishDrawing: () => void;
  onFinishWithWaypoint?: () => void;
  onCancelDrawing: () => void;
  onUndoLastSegment: () => void;
  onClearAllSegments: () => void;
}

export function PassagePlanMobileButtons({
  isWindPreviewMode,
  showRouteActions,
  segmentsCount,
  tempRoutePointsCount,
  onStartRouteDrawing,
  onEnableWindPreview,
  onAddPointAtCenter,
  onFinishDrawing,
  onFinishWithWaypoint,
  onCancelDrawing,
  onUndoLastSegment,
}: PassagePlanMobileButtonsProps) {
  const { t } = useTranslation();

  const iconButton = (onClick: () => void, Icon: any, label: string, bgClass: string) => (
    <Button
      onClick={onClick}
      className={`${bgClass} flex flex-col items-center justify-center gap-1 py-2 px-2 w-11 h-11 text-center`}
    >
      <Icon className="h-3 w-3" />
      <span className="text-[5px] truncate">{label}</span>
    </Button>
  );

  return (
    <div className="md:hidden fixed left-1/2 bottom-[200px] -translate-x-1/2 z-50">
      {/* Przycisk Draw route w Wind Preview Mode */}
      {isWindPreviewMode && (
        <Button 
          onClick={onStartRouteDrawing} 
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-base font-semibold flex items-center gap-2"
        >
          <Route className="w-5 h-5" />
          {t("Draw route")}
        </Button>
      )}

      {/* Przyciski rysowania */}
      {!isWindPreviewMode && showRouteActions && (
        <div className="flex gap-2 items-center justify-center">
          {iconButton(onAddPointAtCenter, PlusCircle, t("Add point"), "bg-blue-600 hover:bg-blue-700")}
          {tempRoutePointsCount >= 1 &&
            iconButton(onFinishWithWaypoint || onFinishDrawing, Flag, t("Add stop"), "bg-green-600 hover:bg-green-700")}
          {segmentsCount > 0 &&
            iconButton(onUndoLastSegment, CornerUpLeft, t("Undo"), "bg-orange-600 hover:bg-orange-700")}
          {iconButton(onCancelDrawing, XCircle, t("Exit"), "bg-red-600 hover:bg-red-700")}
        </div>
      )}

      {/* Przycisk powrotu do rysowania lub Wind Preview gdy są segmenty ale nie ma aktywnego rysowania */}
      {!isWindPreviewMode && !showRouteActions && segmentsCount > 0 && (
        <div className="flex gap-2">
          <Button 
            onClick={onStartRouteDrawing} 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-base font-semibold flex items-center gap-2"
          >
            <Route className="w-5 h-5" />
            {t("Continue route")}
          </Button>
          <Button 
            onClick={onEnableWindPreview} 
            className="bg-slate-600 hover:bg-slate-700 px-4 py-2 text-base font-semibold flex items-center gap-2"
          >
            <Wind className="w-5 h-5" />
            {t("Wind preview")}
          </Button>
        </div>
      )}
    </div>
  );
}