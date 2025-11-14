import { useState } from "react";
import { BottomNavbar } from "@/components/BottomNavbar";
import { useMapInstance } from "../../hooks/useMapInstance";
import { useMapDraw } from "../../hooks/useMapDraw";
import { useSegments } from "../../hooks/useSegments";
import { useDrawingMode } from "../../hooks/useDrawingMode";
import { PassagePlanMap } from "./PassagePlanMap";
import { PassagePlanControls } from "./PassagePlanControls";
import { PassagePlanSegmentsList } from "./PassagePlanSegmentsList";
import { PassagePlanMobileButtons } from "./PassagePlanMobileButtons";
import { PassagePlanDesktopButtons } from "./PassagePlanDesktopButtons";
import { PassagePlanMobileDrawer } from "./PassagePlanMobileDrawer";
import { PassagePlanTimeline } from "./PassagePlanTimeline";
import { WindInfoBox } from "@/components/WindInfoBox"; // ✅ nowy import

export default function PassagePlan() {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [defaultSpeed, setDefaultSpeed] = useState<number>(5);
  const [currentWind, setCurrentWind] = useState<{ speed: number; dir: number } | null>(null); // ✅ nowy stan

  const { mapRef, setTime, getWindAt } = useMapInstance();
  const updateSegmentsRef = { current: async () => {} };
  const drawRef = useMapDraw(mapRef, {
    enforceSingleLine: async (_e: any) => {},
    updateSegments: async () => await updateSegmentsRef.current(),
  });

  const segmentsHook = useSegments(mapRef, drawRef, startDate, defaultSpeed);
  const {
    segments,
    lastCoordRef,
    updateSegments,
    handleSpeedChange,
    handleStopChange,
    handleNameChange,
  } = segmentsHook;

  updateSegmentsRef.current = updateSegments;

  const drawing = useDrawingMode(mapRef, drawRef, lastCoordRef, updateSegments);
  const {
    isDrawingMode,
    tempRoutePoints,
    showRouteActions,
    showCursorOnMobile,
    addPointAtCenter,
    finishDrawing,
    cancelDrawing,
    startRouteDrawing,
    startDrawing,
    undoLastSegment,
    clearAllSegments,
  } = drawing;

  return (
    <div className="flex flex-col items-center gap-6 p-0 md:p-6 text-white relative">
      <PassagePlanMap isDrawingMode={isDrawingMode} showCursorOnMobile={showCursorOnMobile}>
        {currentWind && <WindInfoBox wind={currentWind} />} {/* ✅ wyświetlanie nad mapą */}

        <PassagePlanMobileButtons
          showRouteActions={showRouteActions}
          segmentsCount={segments.length}
          tempRoutePointsCount={tempRoutePoints.length}
          onStartRouteDrawing={startRouteDrawing}
          onAddPointAtCenter={addPointAtCenter}
          onFinishDrawing={finishDrawing}
          onCancelDrawing={cancelDrawing}
          onUndoLastSegment={undoLastSegment}
          onClearAllSegments={clearAllSegments}
        />

        <PassagePlanDesktopButtons
          segmentsCount={segments.length}
          tempRoutePointsCount={tempRoutePoints.length}
          onUndoLastSegment={undoLastSegment}
          onClearAllSegments={clearAllSegments}
        />

        <PassagePlanTimeline
          mapRef={mapRef}
          drawRef={drawRef}
          segments={segments}
          startDate={startDate}
          setTime={setTime}
          getWindAt={getWindAt}
          onWindInfoChange={setCurrentWind}
        />
      </PassagePlanMap>

      <div className="hidden md:block w-full max-w-6xl bg-slate-800 p-6 rounded-lg space-y-6 shadow-lg">
        <PassagePlanControls
          startDate={startDate}
          defaultSpeed={defaultSpeed}
          segmentsCount={segments.length}
          showRouteActions={showRouteActions}
          isDrawingMode={isDrawingMode}
          onStartDateChange={setStartDate}
          onDefaultSpeedChange={setDefaultSpeed}
          onStartRouteDrawing={startRouteDrawing}
          onStartDrawing={startDrawing}
          onFinishDrawing={finishDrawing}
          onCancelDrawing={cancelDrawing}
          onUndoLastSegment={undoLastSegment}
          onClearAllSegments={clearAllSegments}
        />

        <PassagePlanSegmentsList
          segments={segments}
          onSpeedChange={handleSpeedChange}
          onStopChange={handleStopChange}
          onNameChange={handleNameChange}
        />
      </div>

      <PassagePlanMobileDrawer
        startDate={startDate}
        defaultSpeed={defaultSpeed}
        segments={segments}
        onStartDateChange={setStartDate}
        onDefaultSpeedChange={setDefaultSpeed}
        onSpeedChange={handleSpeedChange}
        onStopChange={handleStopChange}
        onNameChange={handleNameChange}
      />

      <BottomNavbar />
    </div>
  );
}
