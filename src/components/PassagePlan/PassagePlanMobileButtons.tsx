import { Button } from "@/components/ui/button";

interface PassagePlanMobileButtonsProps {
  showRouteActions: boolean;
  isDrawingMode: boolean;
  segmentsCount: number;
  tempRoutePointsCount: number;
  onStartRouteDrawing: () => void;
  onStartDrawing: () => void;
  onAddPointAtCenter: () => void;
  onFinishDrawing: () => void;
  onCancelDrawing: () => void;
  onUndoLastSegment: () => void;
  onClearAllSegments: () => void;
}

export function PassagePlanMobileButtons({
  showRouteActions,
  isDrawingMode,
  segmentsCount,
  tempRoutePointsCount,
  onStartRouteDrawing,
  onStartDrawing,
  onAddPointAtCenter,
  onFinishDrawing,
  onCancelDrawing,
  onUndoLastSegment,
  onClearAllSegments,
}: PassagePlanMobileButtonsProps) {
  return (
    <div className="md:hidden fixed left-1/2 bottom-1/4 -translate-x-1/2 z-50">
      {!showRouteActions ? (
        <Button onClick={onStartRouteDrawing} className="bg-slate-900 hover:bg-blue-700">
          Rysuj trasę
        </Button>
      ) : !isDrawingMode ? (
        <div className="flex flex-col items-center gap-2">
          <Button onClick={onStartDrawing}>
            {segmentsCount === 0 ? "Zacznij trasę" : "Kontynuuj trasę"}
          </Button>
          <Button onClick={onUndoLastSegment}>Cofnij</Button>
          <Button onClick={onClearAllSegments}>Usuń wszystko</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center">
          <Button onClick={onAddPointAtCenter} className="bg-blue-600 hover:bg-blue-700">
            Dodaj punkt
          </Button>
          <Button onClick={onCancelDrawing} className="bg-red-600 hover:bg-red-700">
            Anuluj
          </Button>
          {tempRoutePointsCount >= 2 && (
            <Button onClick={onFinishDrawing} className="bg-green-600 hover:bg-green-700 w-full">
              Dodaj postój
            </Button>
          )}
        </div>
      )}
    </div>
  );
}