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

  const removeAllClickPoints = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    clickPointsRef.current.forEach((pointId) => {
      try {
        if (map.getLayer(pointId)) {
          map.removeLayer(pointId);
        }
      } catch (e) {
        // ignore
      }
      try {
        if (map.getSource(pointId)) {
          map.removeSource(pointId);
        }
      } catch (e) {
        // ignore
      }
    });

    clickPointsRef.current.clear();
  }, [mapRef]);

  const removeAllTempDrawFeatures = useCallback(() => {
    const draw = drawRef.current;
    if (!draw) return;
    try {
      draw
        .getAll()
        .features.filter((f) => f.properties?.temp)
        .forEach((f) => {
          try {
            draw.delete(f.id);
          } catch (e) {
            // ignore
          }
        });
    } catch (e) {
      // ignore
    }
  }, [drawRef]);

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
        removeAllTempDrawFeatures();

        draw.add({
          type: "Feature",
          properties: { temp: true },
          geometry: { type: "LineString", coordinates: updated },
        });
      }

      const pointId = `click-point-${updated.length}`;
      if (map && !map.getSource(pointId)) {
        try {
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
        } catch (e) {
          // ignore
        }
      }

      return updated;
    });
  }, [mapRef, drawRef, isDrawingMode, lastCoordRef, removeAllTempDrawFeatures]);

  const finishDrawing = useCallback(() => {
    const draw = drawRef.current;
    const map = mapRef.current;
    if (!draw || !map || tempRoutePoints.length < 2) return;

    removeAllTempDrawFeatures();
    removeAllClickPoints();

    draw.add({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: tempRoutePoints },
    });

    lastCoordRef.current = tempRoutePoints[tempRoutePoints.length - 1];
    setTempRoutePoints([lastCoordRef.current]);

    onUpdateSegments();
  }, [drawRef, mapRef, tempRoutePoints, onUpdateSegments, lastCoordRef, removeAllClickPoints, removeAllTempDrawFeatures]);

  const finishWithWaypoint = useCallback(() => {
    const map = mapRef.current;
    if (!map || !isDrawingMode || tempRoutePoints.length < 1) return;

    const center = map.getCenter();
    const waypointCoord: [number, number] = [center.lng, center.lat];

    const updatedPoints = [...tempRoutePoints, waypointCoord];

    const draw = drawRef.current;
    if (!draw) return;

    removeAllTempDrawFeatures();
    removeAllClickPoints();

    draw.add({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: updatedPoints },
    });

    lastCoordRef.current = updatedPoints[updatedPoints.length - 1];
    setTempRoutePoints([lastCoordRef.current]);

    onUpdateSegments();
  }, [mapRef, drawRef, isDrawingMode, tempRoutePoints, onUpdateSegments, lastCoordRef, removeAllClickPoints, removeAllTempDrawFeatures]);

  const cancelDrawing = useCallback(() => {
    const draw = drawRef.current;

    removeAllTempDrawFeatures();
    removeAllClickPoints();

    setIsDrawingMode(false);
    setTempRoutePoints([]);
    setShowRouteActions(false);
    setShowCursorOnMobile(false);

    if (draw) {
      const lines = draw.getAll().features.filter((f) => f.geometry.type === "LineString" && !f.properties?.temp);
      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        if (lastLine.geometry.type === "LineString") {
          const coords = lastLine.geometry.coordinates as [number, number][];
          lastCoordRef.current = coords[coords.length - 1];
        }
      } else {
        lastCoordRef.current = null;
      }
    }
  }, [drawRef, removeAllClickPoints, removeAllTempDrawFeatures, lastCoordRef]);

  const exitDrawingMode = useCallback(() => {
    cancelDrawing();
  }, [cancelDrawing]);

  const startRouteDrawing = useCallback(() => {
    setIsDrawingMode(true);
    setShowRouteActions(true);

    if (lastCoordRef.current) {
      setTempRoutePoints([lastCoordRef.current]);
    } else {
      setTempRoutePoints([]);
    }

    if (isMobile) setShowCursorOnMobile(true);
  }, [lastCoordRef, isMobile]);

  const startDrawing = useCallback(() => {
    setIsDrawingMode(true);

    if (lastCoordRef.current) {
      setTempRoutePoints([lastCoordRef.current]);
    } else {
      setTempRoutePoints([]);
    }

    if (isMobile) setShowCursorOnMobile(true);
  }, [lastCoordRef, isMobile]);

  const undoLastSegment = useCallback(async () => {
    const draw = drawRef.current;
    if (!draw) return;

    removeAllTempDrawFeatures();

    const hasTempPoints = tempRoutePoints.length > 1;

    if (hasTempPoints) {
      setTempRoutePoints((prev) => {
        if (prev.length <= 1) return prev;
        const updated = prev.slice(0, -1);

        const lastPointId = `click-point-${prev.length}`;
        const map = mapRef.current;
        if (map) {
          try {
            if (map.getLayer(lastPointId)) map.removeLayer(lastPointId);
          } catch (e) {
            // ignore
          }
          try {
            if (map.getSource(lastPointId)) map.removeSource(lastPointId);
          } catch (e) {
            // ignore
          }
          clickPointsRef.current.delete(lastPointId);
        }

        if (updated.length >= 2) {
          try {
            draw.add({
              type: "Feature",
              properties: { temp: true },
              geometry: { type: "LineString", coordinates: updated },
            });
          } catch (e) {
            // ignore
          }
        }

        return updated;
      });

      return;
    }

    const lines = draw
      .getAll()
      .features.filter((f) => f.geometry.type === "LineString" && !f.properties?.temp);
    if (lines.length === 0) return;

    try {
      draw.delete(lines[lines.length - 1].id);
    } catch (e) {
      // ignore
    }

    removeAllTempDrawFeatures();

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
  }, [drawRef, onUpdateSegments, lastCoordRef, isDrawingMode, tempRoutePoints, mapRef, removeAllClickPoints, removeAllTempDrawFeatures]);

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
    lastCoordRef.current = null;

    if (segmentsHook?.resetUnknownCounter) {
      segmentsHook.resetUnknownCounter();
    }
  }, [drawRef, mapRef, onUpdateSegments, segmentsHook, removeAllClickPoints, lastCoordRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const addPoint = (lng: number, lat: number) => {
      if (!isDrawingMode) return;

      setTempRoutePoints((prev) => {
        let updated: [number, number][] = prev;
        if (prev.length === 0 && lastCoordRef.current) updated = [lastCoordRef.current];
        const newPoint: [number, number] = [lng, lat];
        const newPoints = [...updated, newPoint];

        const draw = drawRef.current;
        if (draw) {
          removeAllTempDrawFeatures();

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
          try {
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
          } catch (e) {
            // ignore
          }
        }

        return newPoints;
      });
    };

    const updatePreview = (lng: number, lat: number) => {
      if (!isDrawingMode || tempRoutePoints.length === 0) return;
      const previewCoords: [number, number][] = [...tempRoutePoints, [lng, lat]];
      const draw = drawRef.current;
      if (draw) {
        removeAllTempDrawFeatures();
        try {
          draw.add({
            type: "Feature",
            properties: { temp: true },
            geometry: { type: "LineString", coordinates: previewCoords },
          });
        } catch (e) {
          // ignore
        }
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
      try {
        map.getCanvas().style.cursor = isMobile ? "" : "crosshair";
      } catch (e) {
        // ignore
      }

      if (isMobile) map.on("move", handleMapMove);
      else {
        map.on("click", handleClick);
        map.on("mousemove", handleMouseMove);
      }

      return () => {
        try {
          map.getCanvas().style.cursor = "";
        } catch (e) {
          // ignore
        }
        if (isMobile) map.off("move", handleMapMove);
        else {
          map.off("click", handleClick);
          map.off("mousemove", handleMouseMove);
        }
      };
    }
  }, [isDrawingMode, mapRef, drawRef, lastCoordRef, tempRoutePoints, isMobile, removeAllTempDrawFeatures]);

  // Enter / Escape / Backspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDrawingMode) return;
      if (e.key === "Enter" && tempRoutePoints.length >= 2) {
        e.preventDefault();
        finishDrawing();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        exitDrawingMode();
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        undoLastSegment();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawingMode, tempRoutePoints, finishDrawing, exitDrawingMode, undoLastSegment]);

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