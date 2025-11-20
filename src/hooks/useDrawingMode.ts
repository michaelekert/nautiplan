import { useState, useEffect, useCallback, useRef } from "react";
import { Map } from "@maptiler/sdk";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

export function useDrawingMode(
  mapRef: React.RefObject<Map | null>,
  drawRef: React.RefObject<MapboxDraw | null>,
  lastCoordRef: React.RefObject<[number, number] | null>,
  onUpdateSegments: () => void,
  segmentsHook?: { resetUnknownCounter?: () => void }
) {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [tempRoutePoints, setTempRoutePoints] = useState<[number, number][]>([]);
  const [showRouteActions, setShowRouteActions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCursorOnMobile, setShowCursorOnMobile] = useState(false);
  
  const clickPointsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile && !isDrawingMode) {
      setIsDrawingMode(true);
    }
  }, [isMobile, isDrawingMode]);

  const removeAllClickPoints = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    clickPointsRef.current.forEach((pointId) => {
      try {
        if (map.getLayer(pointId)) {
          map.removeLayer(pointId);
        }
      } catch (e) {
      }
      try {
        if (map.getSource(pointId)) {
          map.removeSource(pointId);
        }
      } catch (e) {
        console.error("Błąd usuwania źródła:", pointId, e);
      }
    });
    
    clickPointsRef.current.clear();

  }, [mapRef]);

  const addPointAtCenter = useCallback(() => {
    const map = mapRef.current;
    if (!map || !isDrawingMode) return;

    const center = map.getCenter();
    const newPoint: [number, number] = [center.lng, center.lat];

    setTempRoutePoints((prev) => {
      if (prev.length === 0 && lastCoordRef.current) prev = [lastCoordRef.current];
      const updated = [...prev, newPoint];

      const draw = drawRef.current;
      if (draw && updated.length >= 2) {
        const tempFeature = draw.getAll().features.find((f) => f.properties?.temp);
        if (tempFeature) draw.delete(tempFeature.id);

        draw.add({
          type: "Feature",
          properties: { temp: true },
          geometry: { type: "LineString", coordinates: updated },
        });
      }

      const pointId = `click-point-${updated.length}`;
      if (map && !map.getSource(pointId)) {
        map.addSource(pointId, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: { type: "Point", coordinates: newPoint },
                properties: null,
              },
            ],
          },
        });
        map.addLayer({
          id: pointId,
          type: "circle",
          source: pointId,
          paint: {
            "circle-radius": 5,
            "circle-color": "#facc15",
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 1.5,
          },
        });
        clickPointsRef.current.add(pointId);
      }

      return updated;
    });
  }, [mapRef, drawRef, isDrawingMode, lastCoordRef]);

  const finishDrawing = useCallback(() => {
    const draw = drawRef.current;
    const map = mapRef.current;
    if (!draw || !map || tempRoutePoints.length < 2) return;

    draw.getAll().features
      .filter((f) => f.properties?.temp)
      .forEach((f) => draw.delete(f.id));

    removeAllClickPoints();

    draw.add({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: tempRoutePoints },
    });

    if (isMobile) {
      lastCoordRef.current = tempRoutePoints[tempRoutePoints.length - 1];
      setTempRoutePoints([lastCoordRef.current]);
    } else {
      setIsDrawingMode(false);
      setTempRoutePoints([]);
      setShowRouteActions(false);
      setShowCursorOnMobile(false);
    }
    
    onUpdateSegments();
  }, [drawRef, mapRef, tempRoutePoints, onUpdateSegments, lastCoordRef, isMobile, removeAllClickPoints]);

  const finishWithWaypoint = useCallback(() => {
    const map = mapRef.current;
    if (!map || !isDrawingMode || tempRoutePoints.length < 1) return;

    const center = map.getCenter();
    const waypointCoord: [number, number] = [center.lng, center.lat];

    const updatedPoints = [...tempRoutePoints, waypointCoord];
    
    const draw = drawRef.current;
    if (!draw) return;

    draw.getAll().features
      .filter((f) => f.properties?.temp)
      .forEach((f) => draw.delete(f.id));

    removeAllClickPoints();

    draw.add({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: updatedPoints },
    });

    if (isMobile) {
      lastCoordRef.current = updatedPoints[updatedPoints.length - 1];
      setTempRoutePoints([lastCoordRef.current]);
    } else {
      setIsDrawingMode(false);
      setTempRoutePoints([]);
      setShowRouteActions(false);
      setShowCursorOnMobile(false);
    }
    
    onUpdateSegments();
  }, [mapRef, drawRef, isDrawingMode, tempRoutePoints, onUpdateSegments, lastCoordRef, isMobile, removeAllClickPoints]);

  const cancelDrawing = useCallback(() => {
    const draw = drawRef.current;

    if (draw)
      draw
        .getAll()
        .features.filter((f) => f.properties?.temp)
        .forEach((f) => draw.delete(f.id));
    
    removeAllClickPoints();

    setIsDrawingMode(false);
    setTempRoutePoints([]);
    setShowRouteActions(false);
    setShowCursorOnMobile(false);
    
    const draw2 = drawRef.current;
    if (draw2) {
      const lines = draw2.getAll().features.filter((f) => f.geometry.type === "LineString");
      if (lines.length === 0) {
        lastCoordRef.current = null;
      }
    }
  }, [drawRef, removeAllClickPoints, lastCoordRef]);

  const exitDrawingMode = useCallback(() => {
    cancelDrawing();
  }, [cancelDrawing]);

  const startRouteDrawing = useCallback(() => {
    setIsDrawingMode(true);
    setShowRouteActions(true);
    setTempRoutePoints([]);
    if (lastCoordRef.current) setTempRoutePoints([lastCoordRef.current]);
    if (isMobile) setShowCursorOnMobile(true);
  }, [lastCoordRef, isMobile]);

  const startDrawing = useCallback(() => {
    setIsDrawingMode(true);
    setTempRoutePoints([]);
    if (lastCoordRef.current) setTempRoutePoints([lastCoordRef.current]);
    if (isMobile) setShowCursorOnMobile(true);
  }, [lastCoordRef, isMobile]);

  const undoLastSegment = useCallback(async () => {
    const draw = drawRef.current;
    if (!draw) return;
    const lines = draw
      .getAll()
      .features.filter((f) => f.geometry.type === "LineString");
    if (lines.length === 0) return;
    
    
    draw.delete(lines[lines.length - 1].id);
    
    if (lines.length > 1) {
      const prevLine = lines[lines.length - 2];
      if (prevLine.geometry.type === "LineString") {
        const coords = prevLine.geometry.coordinates as [number, number][];
        lastCoordRef.current = coords[coords.length - 1];
      }
    } else {
      lastCoordRef.current = null;
    }
    
    if (isDrawingMode) {
      setTempRoutePoints(lastCoordRef.current ? [lastCoordRef.current] : []);
    }
    
    removeAllClickPoints();
    
    await onUpdateSegments();
  }, [drawRef, onUpdateSegments, lastCoordRef, isDrawingMode, removeAllClickPoints]);

  const clearAllSegments = useCallback(() => {
    const draw = drawRef.current;
    const map = mapRef.current;
    if (!draw || !map) return;

    draw.deleteAll();
    
    removeAllClickPoints();

    onUpdateSegments();
    setTempRoutePoints([]);
    setIsDrawingMode(false);
    setShowRouteActions(false);
    setShowCursorOnMobile(false);

    if (segmentsHook?.resetUnknownCounter) {
      segmentsHook.resetUnknownCounter();
    }
  }, [drawRef, mapRef, onUpdateSegments, segmentsHook, removeAllClickPoints]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const addPoint = (lng: number, lat: number) => {
      if (!isDrawingMode) return;

      setTempRoutePoints((prev) => {
        let updated: [number, number][] = prev;
        if (prev.length === 0 && lastCoordRef.current)
          updated = [lastCoordRef.current];
        const newPoint: [number, number] = [lng, lat];
        const newPoints = [...updated, newPoint];

        const draw = drawRef.current;
        if (draw) {
          draw
            .getAll()
            .features.filter((f) => f.properties?.temp)
            .forEach((f) => draw.delete(f.id));
          if (newPoints.length >= 2) {
            draw.add({
              type: "Feature",
              properties: { temp: true },
              geometry: { type: "LineString", coordinates: newPoints },
            });
          }
        }

        const pointId = `click-point-${newPoints.length}`;
        if (!map.getSource(pointId)) {
          map.addSource(pointId, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: { type: "Point", coordinates: newPoint },
                  properties: null,
                },
              ],
            },
          });
          map.addLayer({
            id: pointId,
            type: "circle",
            source: pointId,
            paint: {
              "circle-radius": 5,
              "circle-color": "#facc15",
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 1.5,
            },
          });
          clickPointsRef.current.add(pointId);
        }

        return newPoints;
      });
    };

    const updatePreview = (lng: number, lat: number) => {
      if (!isDrawingMode || tempRoutePoints.length === 0) return;
      const previewCoords: [number, number][] = [
        ...tempRoutePoints,
        [lng, lat],
      ];
      const draw = drawRef.current;
      if (draw) {
        draw
          .getAll()
          .features.filter((f) => f.properties?.temp)
          .forEach((f) => draw.delete(f.id));
        draw.add({
          type: "Feature",
          properties: { temp: true },
          geometry: { type: "LineString", coordinates: previewCoords },
        });
      }
    };

    const handleClick = (e: any) => addPoint(e.lngLat.lng, e.lngLat.lat);
    const handleMouseMove = (e: any) => updatePreview(e.lngLat.lng, e.lngLat.lat);
    const handleMapMove = () => {
      if (!isDrawingMode || tempRoutePoints.length === 0 || !isMobile) return;
      const center = map.getCenter();
      updatePreview(center.lng, center.lat);
    };

    if (isDrawingMode) {
      map.getCanvas().style.cursor = isMobile ? "" : "crosshair";
      if (isMobile) map.on("move", handleMapMove);
      else {
        map.on("click", handleClick);
        map.on("mousemove", handleMouseMove);
      }

      return () => {
        map.getCanvas().style.cursor = "";
        if (isMobile) map.off("move", handleMapMove);
        else {
          map.off("click", handleClick);
          map.off("mousemove", handleMouseMove);
        }
      };
    }
  }, [isDrawingMode, mapRef, drawRef, lastCoordRef, tempRoutePoints, isMobile]);

  // Enter / Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDrawingMode) return;
      if (e.key === "Enter" && tempRoutePoints.length >= 2) finishDrawing();
      if (e.key === "Escape") exitDrawingMode();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawingMode, tempRoutePoints, finishDrawing, exitDrawingMode]);

  return {
    isDrawingMode,
    tempRoutePoints,
    showRouteActions,
    showCursorOnMobile,
    addPointAtCenter,
    finishDrawing,
    finishWithWaypoint,
    cancelDrawing,
    exitDrawingMode,
    startRouteDrawing,
    startDrawing,
    undoLastSegment,
    clearAllSegments,
  };
}