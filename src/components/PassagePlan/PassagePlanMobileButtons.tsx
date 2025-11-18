import { Button } from "@/components/ui/button";
import { PlusCircle, Flag, XCircle, CornerUpLeft, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PassagePlanMobileButtonsProps {
  showRouteActions: boolean;
  segmentsCount: number;
  tempRoutePointsCount: number;
  onStartRouteDrawing: () => void;
  onAddPointAtCenter: () => void;
  onFinishDrawing: () => void;
  onFinishWithWaypoint?: () => void;
  onCancelDrawing: () => void;
  onUndoLastSegment: () => void;
  onClearAllSegments: () => void;
}

export function PassagePlanMobileButtons({
  showRouteActions,
  segmentsCount,
  tempRoutePointsCount,
  onStartRouteDrawing,
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
      {!showRouteActions ? (
        <Button onClick={onStartRouteDrawing} className="bg-slate-900 hover:bg-blue-700 px-2 py-2">
          {t("Draw route")}
        </Button>
      ) : (
        <div className="flex gap-2 items-center justify-center">
          {iconButton(onAddPointAtCenter, PlusCircle, t("Add point"), "bg-blue-600 hover:bg-blue-700")}
          {tempRoutePointsCount >= 1 &&
            iconButton(onFinishWithWaypoint || onFinishDrawing, Flag, t("Add stop"), "bg-green-600 hover:bg-green-700")}
          {segmentsCount > 0 &&
            iconButton(onUndoLastSegment, CornerUpLeft, t("Undo"), "bg-orange-600 hover:bg-orange-700")}
          {iconButton(onCancelDrawing, XCircle, t("Exit"), "bg-red-600 hover:bg-red-700")}
        </div>
      )}
    </div>
  );
}
