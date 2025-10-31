import { useState, useEffect, useCallback } from "react";
import { Map } from "@maptiler/sdk";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

export function useDrawingMode(
  mapRef: React.RefObject<Map | null>,
  drawRef: React.RefObject<MapboxDraw | null>,
  lastCoordRef: React.RefObject<[number, number] | null>,
  onUpdateSegments: () => void
) {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [tempRoutePoints, setTempRoutePoints] = useState<[number, number][]>([]);
  const [showRouteActions, setShowRouteActions] = useState(false);

  const addPointAtCenter = useCallback(() => {
    const map = mapRef.current;
    if (!map || !isDrawingMode) return;

    const center = map.getCenter();
    const newPoint: [number, number] = [center.lng, center.lat];

    setTempRoutePoints((prev) => {
      if (prev.length === 0 && lastCoordRef.current) {
        prev = [lastCoordRef.current];
      }
      const updated = [...prev, newPoint];
      const draw = drawRef.current;
      if (draw && updated.length >= 2) {
        const tempFeature = draw
          .getAll()
          .features.find((f) => f.properties?.temp);
        if (tempFeature) draw.delete(tempFeature.id);
        draw.add({
          type: "Feature",
          properties: { temp: true },
          geometry: { type: "LineString", coordinates: updated },
        });
      }
      return updated;
    });
  }, [mapRef, drawRef, isDrawingMode, lastCoordRef]);

  const finishDrawing = useCallback(() => {
    const draw = drawRef.current;
    if (!draw || tempRoutePoints.length < 2) return;

    const tempFeature = draw.getAll().features.find((f) => f.properties?.temp);
    if (tempFeature) draw.delete(tempFeature.id);

    draw.add({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: tempRoutePoints },
    });

    setIsDrawingMode(false);
    setTempRoutePoints([]);
    setShowRouteActions(false);

    onUpdateSegments();
  }, [drawRef, tempRoutePoints, onUpdateSegments]);

  const cancelDrawing = useCallback(() => {
    const draw = drawRef.current;
    if (draw) {
      const tempFeature = draw.getAll().features.find((f) => f.properties?.temp);
      if (tempFeature) draw.delete(tempFeature.id);
    }
    setIsDrawingMode(false);
    setTempRoutePoints([]);
    setShowRouteActions(false);
  }, [drawRef]);

  const startRouteDrawing = useCallback(() => {
    setShowRouteActions(true);
  }, []);

  const startDrawing = useCallback(() => {
    setIsDrawingMode(true);
    setTempRoutePoints([]);
    if (lastCoordRef.current) {
      setTempRoutePoints([lastCoordRef.current]);
    }
  }, [lastCoordRef]);

  const undoLastSegment = useCallback(() => {
    const draw = drawRef.current;
    if (!draw) return;
    const lines = draw
      .getAll()
      .features.filter((f) => f.geometry.type === "LineString");
    if (lines.length === 0) return;
    draw.delete(lines[lines.length - 1].id);
    onUpdateSegments();
  }, [drawRef, onUpdateSegments]);

  const clearAllSegments = useCallback(() => {
    const draw = drawRef.current;
    if (!draw) return;
    draw.deleteAll();
    onUpdateSegments();
  }, [drawRef, onUpdateSegments]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: any) => {
      if (!isDrawingMode) return;
      const { lng, lat } = e.lngLat;
      setTempRoutePoints((prev) => {
        let updated: [number, number][] = prev;
        if (prev.length === 0 && lastCoordRef.current) {
          updated = [lastCoordRef.current];
        }
        const newPoint: [number, number] = [lng, lat];
        const newPoints = [...updated, newPoint];

        const draw = drawRef.current;
        if (draw && newPoints.length >= 2) {
          draw
            .getAll()
            .features.filter((f) => f.properties?.temp)
            .forEach((f) => draw.delete(f.id));
          draw.add({
            type: "Feature",
            properties: { temp: true },
            geometry: { type: "LineString", coordinates: newPoints },
          });
        }

        return newPoints;
      });
    };

    if (isDrawingMode) {
      map.getCanvas().style.cursor = "crosshair";
      map.on("click", handleClick);
    } else {
      map.getCanvas().style.cursor = "";
      map.off("click", handleClick);
    }

    return () => {
      map.getCanvas().style.cursor = "";
      map.off("click", handleClick);
    };
  }, [isDrawingMode, mapRef, drawRef, lastCoordRef]);

  return {
    isDrawingMode,
    tempRoutePoints,
    showRouteActions,
    addPointAtCenter,
    finishDrawing,
    cancelDrawing,
    startRouteDrawing,
    startDrawing,
    undoLastSegment,
    clearAllSegments,
  };
}