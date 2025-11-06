import { useState, useCallback, useRef } from "react";
import * as turf from "@turf/turf";
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

export default function PassagePlan() {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [defaultSpeed, setDefaultSpeed] = useState<number>(5);

  const { mapRef, windLayerRef, setTime, getWindAt } = useMapInstance();

  const updateSegmentsRef = { current: async () => {} };

  const enforceSingleLine = useCallback(async (e: any) => {
    const draw = drawRef.current;
    if (!draw) return;

    const lines = draw.getAll().features.filter(
      (f) => f.geometry.type === "LineString"
    );
    if (lines.length > 1) {
      const lastLine = lines[lines.length - 2] as any;
      const newLine = e.features[0];
      const lastEnd = lastLine.geometry.coordinates.at(-1);
      const newStart = newLine.geometry.coordinates[0];
      const distance = turf.distance(turf.point(lastEnd), turf.point(newStart));
      if (distance > 0.001) {
        draw.delete(newLine.id);
        console.warn("Musisz kontynuować trasę od końca poprzedniego segmentu");
        return;
      }
    }

    await updateSegmentsRef.current();
  }, []);

  const drawRef = useMapDraw(mapRef, {
    enforceSingleLine,
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
  } = useDrawingMode(mapRef, drawRef, lastCoordRef, updateSegments);

  return (
    <div className="flex flex-col items-center gap-6 p-0 md:p-6 text-white relative">
      <PassagePlanMap
        isDrawingMode={isDrawingMode}
        showCursorOnMobile={showCursorOnMobile}
      >
        
        <PassagePlanMobileButtons
          showRouteActions={showRouteActions}
          isDrawingMode={isDrawingMode}
          segmentsCount={segments.length}
          tempRoutePointsCount={tempRoutePoints.length}
          onStartRouteDrawing={startRouteDrawing}
          onStartDrawing={startDrawing}
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
      </PassagePlanMap>

      <PassagePlanTimeline
        mapRef={mapRef}
        windLayerRef={windLayerRef}
        drawRef={drawRef}
        segments={segments}
        startDate={startDate}
        setTime={setTime}
        getWindAt={getWindAt}
      />

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
