import { Button } from "@/components/ui/button";
import { PlusCircle, Flag, Check, CornerUpLeft, Wind, Route } from "lucide-react";
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

  const iconButton = (
    onClick: () => void,
    Icon: any,
    label: string,
    bgClass: string,
    disabled = false
  ) => (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`${bgClass} flex flex-col items-center justify-center gap-1 py-2 px-2 w-11 h-11 text-center
        ${disabled ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" : ""}`}
    >
      <Icon className="h-3 w-3" />
      <span className="text-[5px] truncate">{label}</span>
    </Button>
  );

  const isAddStopDisabled = tempRoutePointsCount < 1;
  const isUndoDisabled = tempRoutePointsCount <= 0;

  return (
    <div className="md:hidden fixed left-1/2 bottom-[210px] -translate-x-1/2 z-50">
      {isWindPreviewMode && (
        <Button onClick={onStartRouteDrawing} className="bg-slate-900 hover:bg-blue-700 px-2 py-2">
          {t("Draw route")}
        </Button>
      )}

      {!isWindPreviewMode && showRouteActions && (
        <div className="flex gap-2 items-center justify-center">
          {iconButton(onCancelDrawing, Check, t("Exit"), "bg-red-600 hover:bg-red-700")}
          {iconButton(onAddPointAtCenter, PlusCircle, t("Add point"), "bg-blue-600 hover:bg-blue-700")}
          {iconButton(
            onFinishWithWaypoint || onFinishDrawing,
            Flag,
            t("Add stop"),
            "bg-green-600 hover:bg-green-700",
            isAddStopDisabled
          )}
          {iconButton(
            onUndoLastSegment,
            CornerUpLeft,
            t("Undo"),
            "bg-orange-600 hover:bg-orange-700",
            isUndoDisabled
          )}
        </div>
      )}

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
