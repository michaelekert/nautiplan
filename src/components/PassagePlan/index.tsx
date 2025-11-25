import { useState } from "react";
import { BottomNavbar } from "@/components/BottomNavbar";
import { useMapInstance } from "../../hooks/useMapInstance";
import { useMapDraw } from "../../hooks/useMapDraw";
import { useSegments } from "../../hooks/useSegments";
import { useDrawingMode } from "../../hooks/useDrawingMode";
import { useRouteSave } from "../../hooks/useRouteSave";
import { useWindPreviewMode } from "../../hooks/useWindPreviewMode";
import { PassagePlanMap } from "./PassagePlanMap";
import { PassagePlanControls } from "./PassagePlanControls";
import { PassagePlanSegmentsList } from "./PassagePlanSegmentsList";
import { PassagePlanMobileButtons } from "./PassagePlanMobileButtons";
import { PassagePlanDesktopButtons } from "./PassagePlanDesktopButtons";
import { PassagePlanMobileDrawer } from "./PassagePlanMobileDrawer";
import { PassagePlanTimeline } from "./PassagePlanTimeline";
import { WindPreviewControls } from "./WindPreviewControls";
import { RouteSaveManager } from "@/components/RouteSaveManager";
import { RouteInfoPanel } from "../RouteInfoPanel";

export default function PassagePlan() {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [defaultSpeed, setDefaultSpeed] = useState<number>(5);

  const { mapRef, windLayerRef, setTime, getWindAt } = useMapInstance();
  
  // Wind Preview Mode - domyślnie włączony
  const windPreview = useWindPreviewMode(mapRef, windLayerRef, getWindAt);
  const {
    isWindPreviewMode,
    windData,
    previewTime,
    timeRange,
    setPreviewTime,
    disableWindPreviewMode,
    enableWindPreviewMode,
  } = windPreview;

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

  // Funkcje przełączania trybów
  const handleStartRouteDrawing = () => {
    disableWindPreviewMode();
    startRouteDrawing();
  };

  const handleStartDrawing = () => {
    disableWindPreviewMode();
    startDrawing();
  };

  const handleCancelDrawing = () => {
    cancelDrawing();
    enableWindPreviewMode();
  };

  const handleFinishDrawing = () => {
    finishDrawing();
    // POPRAWKA: Na mobile zostajemy w trybie rysowania, na desktop NIE wracamy automatycznie
    // Użytkownik sam musi kliknąć "Wind preview"
  };

  const handleFinishWithWaypoint = () => {
    finishWithWaypoint();
    // POPRAWKA: Na mobile zostajemy w trybie rysowania, na desktop NIE wracamy automatycznie
  };

  const handleEnableWindPreview = () => {
    enableWindPreviewMode();
  };

  const handleClearAllSegments = () => {
    clearAllSegments();
    // POPRAWKA: Po usunięciu wszystkich segmentów wracamy do Wind Preview Mode
    enableWindPreviewMode();
  };

  const handleUndoLastSegment = () => {
    undoLastSegment();
    // POPRAWKA: Jeśli po cofnięciu nie ma już segmentów, wracamy do Wind Preview
    setTimeout(() => {
      if (segments.length <= 1) {
        enableWindPreviewMode();
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-0 md:p-6 text-white relative">
      <PassagePlanMap 
        isDrawingMode={isDrawingMode} 
        isWindPreviewMode={isWindPreviewMode}
        showCursorOnMobile={showCursorOnMobile}
      >
        
        {/* Wind Preview Controls - wyświetlane gdy aktywny jest Wind Preview Mode */}
        {isWindPreviewMode && (
          <WindPreviewControls
            windData={windData}
            previewTime={previewTime}
            timeRange={timeRange}
            onTimeChange={setPreviewTime}
          />
        )}

        {/* Route Info Panel - wyświetlane gdy są segmenty LUB tempRoutePoints */}
        {!isWindPreviewMode && (segments.length > 0 || tempRoutePoints.length > 0) && (
          <RouteInfoPanel 
            segments={segments} 
            drawRef={drawRef}
            isDrawingMode={isDrawingMode}
            defaultSpeed={defaultSpeed} 
            mapRef={mapRef}
            tempRoutePoints={tempRoutePoints}
            onClearAllSegments={handleClearAllSegments} 
          />
        )}

        {/* Mobile Buttons */}
        <PassagePlanMobileButtons
          isWindPreviewMode={isWindPreviewMode}
          showRouteActions={showRouteActions}
          segmentsCount={segments.length}
          tempRoutePointsCount={tempRoutePoints.length}
          onStartRouteDrawing={handleStartRouteDrawing}
          onEnableWindPreview={handleEnableWindPreview}
          onAddPointAtCenter={addPointAtCenter}
          onFinishWithWaypoint={handleFinishWithWaypoint}
          onFinishDrawing={handleFinishDrawing}
          onCancelDrawing={handleCancelDrawing}
          onUndoLastSegment={handleUndoLastSegment}
          onClearAllSegments={handleClearAllSegments}
        />

        {/* Desktop Buttons */}
        <PassagePlanDesktopButtons
          isWindPreviewMode={isWindPreviewMode}
          isDrawingMode={isDrawingMode}
          segmentsCount={segments.length}
          tempRoutePointsCount={tempRoutePoints.length}
          onStartRouteDrawing={handleStartRouteDrawing}
          onEnableWindPreview={handleEnableWindPreview}
          onUndoLastSegment={handleUndoLastSegment}
          onClearAllSegments={handleClearAllSegments}
        />

        {/* Timeline - wyświetlane gdy są segmenty i nie ma Wind Preview Mode */}
        {!isWindPreviewMode && segments.length > 0 && (
          <PassagePlanTimeline
            mapRef={mapRef}
            drawRef={drawRef}
            segments={segments}
            startDate={startDate}
            setTime={setTime}
            getWindAt={getWindAt}
            onWindInfoChange={() => {}}
          />
        )}
      </PassagePlanMap>

      {/* Desktop Controls Panel - tylko gdy nie ma Wind Preview */}
      {!isWindPreviewMode && (
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
              onStartRouteDrawing={handleStartRouteDrawing}
              onStartDrawing={handleStartDrawing}
              onFinishDrawing={handleFinishDrawing}
              onCancelDrawing={handleCancelDrawing}
              onUndoLastSegment={handleUndoLastSegment}
              onClearAllSegments={handleClearAllSegments}
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
      )}

      {/* Mobile Drawer - tylko gdy nie ma Wind Preview */}
      {!isWindPreviewMode && (
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
      )}

      <BottomNavbar />
    </div>
  );
}