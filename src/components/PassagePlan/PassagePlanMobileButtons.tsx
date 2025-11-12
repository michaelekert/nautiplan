import { Button } from "@/components/ui/button";
import { MapPin, PlusCircle, Flag, XCircle, CornerUpLeft, Trash } from "lucide-react";

interface PassagePlanMobileButtonsProps {
  showRouteActions: boolean;
  segmentsCount: number;
  tempRoutePointsCount: number;
  onStartRouteDrawing: () => void;
  onAddPointAtCenter: () => void;
  onFinishDrawing: () => void;
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
  onCancelDrawing,
  onUndoLastSegment,
  onClearAllSegments,
}: PassagePlanMobileButtonsProps) {
  return (
    <div className="md:hidden fixed left-1/2 bottom-1/4 -translate-x-1/2 z-50">
      {!showRouteActions ? (
        <Button
          onClick={onStartRouteDrawing}
          className="bg-slate-900 hover:bg-blue-700 flex items-center justify-center"
          size="icon"
        >
          <MapPin className="h-5 w-5" />
        </Button>
      ) : (
        <div className="flex gap-2 items-center justify-center flex-wrap">
          {/* Rysowanie */}
          <Button
            onClick={onAddPointAtCenter}
            className="bg-blue-600 hover:bg-blue-700"
            size="icon"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Button
            onClick={onCancelDrawing}
            className="bg-red-600 hover:bg-red-700"
            size="icon"
          >
            <XCircle className="h-5 w-5" />
          </Button>
          {tempRoutePointsCount >= 2 && (
            <Button
              onClick={onFinishDrawing}
              className="bg-green-600 hover:bg-green-700"
              size="icon"
            >
              <Flag className="h-5 w-5" />
            </Button>
          )}

          {/* Odcinki istniejące */}
          {segmentsCount > 0 && (
            <>
              <Button
                onClick={onUndoLastSegment}
                className="bg-orange-600 hover:bg-orange-700"
                size="icon"
              >
                <CornerUpLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={onClearAllSegments}
                className="bg-red-800 hover:bg-red-900"
                size="icon"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
