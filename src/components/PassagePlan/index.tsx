import { useState } from "react";
import { BottomNavbar } from "@/components/BottomNavbar";
import { useMapInstance } from "../../hooks/useMapInstance";
import { useMapDraw } from "../../hooks/useMapDraw";
import { useSegments } from "../../hooks/useSegments";
import { useDrawingMode } from "../../hooks/useDrawingMode";
import { useRouteSave } from "../../hooks/useRouteSave";
import { PassagePlanMap } from "./PassagePlanMap";
import { PassagePlanControls } from "./PassagePlanControls";
import { PassagePlanSegmentsList } from "./PassagePlanSegmentsList";
import { PassagePlanMobileButtons } from "./PassagePlanMobileButtons";
import { PassagePlanDesktopButtons } from "./PassagePlanDesktopButtons";
import { PassagePlanMobileDrawer } from "./PassagePlanMobileDrawer";
import { PassagePlanTimeline } from "./PassagePlanTimeline";
import { WindInfoBox } from "@/components/WindInfoBox";
import { RouteSaveManager } from "@/components/RouteSaveManager";

export default function PassagePlan() {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [defaultSpeed, setDefaultSpeed] = useState<number>(5);
  const [currentWind, setCurrentWind] = useState<{ speed: number; dir: number } | null>(null);

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
    finishWithWaypoint,
    finishDrawing,
    cancelDrawing,
    startRouteDrawing,
    startDrawing,
    undoLastSegment,
    clearAllSegments,
  } = drawing;

  const { saveRoute, loadRoute, deleteRoute, getSavedRoutes } = useRouteSave(
    mapRef,
    drawRef,
    segments,
    startDate,
    defaultSpeed
  );

  const handleSaveRoute = (name: string) => {
    saveRoute(name);
  };

  const handleLoadRoute = (routeId: string) => {
    const success = loadRoute(routeId, updateSegments);
    if (success) {
      const routes = getSavedRoutes();
      const loadedRoute = routes.find((r) => r.id === routeId);
      if (loadedRoute) {
        setStartDate(loadedRoute.startDate);
        setDefaultSpeed(loadedRoute.defaultSpeed);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-0 md:p-6 text-white relative">
      <PassagePlanMap isDrawingMode={isDrawingMode} showCursorOnMobile={showCursorOnMobile}>
        {currentWind && <WindInfoBox wind={currentWind} />}

        <PassagePlanMobileButtons
          showRouteActions={showRouteActions}
          segmentsCount={segments.length}
          tempRoutePointsCount={tempRoutePoints.length}
          onStartRouteDrawing={startRouteDrawing}
          onAddPointAtCenter={addPointAtCenter}
          onFinishWithWaypoint={finishWithWaypoint}
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
        <div className="flex flex-row flex-wrap items-end gap-1">
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

          <RouteSaveManager
            onSave={handleSaveRoute}
            onLoad={handleLoadRoute}
            onDelete={deleteRoute}
            getSavedRoutes={getSavedRoutes}
            hasActiveRoute={segments.length > 0}
          />
        </div>

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
        onSaveRoute={handleSaveRoute}
        onLoadRoute={handleLoadRoute}
        onDeleteRoute={deleteRoute}
        getSavedRoutes={getSavedRoutes}
      />

      <BottomNavbar />
    </div>
  );
}
