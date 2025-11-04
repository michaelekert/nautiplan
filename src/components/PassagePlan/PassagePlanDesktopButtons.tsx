import { Button } from "@/components/ui/button";

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
  return (
    <div className="hidden md:flex flex-col items-center gap-3 absolute left-1/2 bottom-10 -translate-x-1/2 z-50">
      {tempRoutePointsCount > 0 && (
        <div className="bg-slate-900/90 text-white px-4 py-2 rounded-lg text-sm">
          {tempRoutePointsCount >= 2 ? (
            <span>✓ Naciśnij <strong>Enter</strong> aby dodać postój lub klikaj dalej</span>
          ) : (
            <span>Kliknij aby dodać punkty • <strong>Esc</strong> anuluje</span>
          )}
        </div>
      )}

      {segmentsCount > 0 && tempRoutePointsCount === 0 && (
        <div className="flex gap-2">
          <Button onClick={onUndoLastSegment} variant="secondary">
            Cofnij ostatni
          </Button>
          <Button onClick={onClearAllSegments} variant="destructive">
            Usuń wszystko
          </Button>
        </div>
      )}
    </div>
  );
}