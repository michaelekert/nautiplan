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
  const [isMobile, setIsMobile] = useState(false);

  // detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          geometry: {
            type: "LineString",
            coordinates: updated,
          },
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
                geometry: {
                  type: "Point",
                  coordinates: newPoint,
                },
                properties: null
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
      }

      return updated;
    });
  }, [mapRef, drawRef, isDrawingMode, lastCoordRef]);

  const finishDrawing = useCallback(() => {
    const draw = drawRef.current;
    const map = mapRef.current;
    if (!draw || !map || tempRoutePoints.length < 2) return;

    draw.getAll().features.filter(f => f.properties?.temp).forEach(f => draw.delete(f.id));

    tempRoutePoints.forEach((_, i) => {
      const pointId = `click-point-${i + 1}`;
      if (map.getLayer(pointId)) map.removeLayer(pointId);
      if (map.getSource(pointId)) map.removeSource(pointId);
    });

    draw.add({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: tempRoutePoints,
      },
    });

    setIsDrawingMode(false);
    setTempRoutePoints([]);
    setShowRouteActions(false);
    onUpdateSegments();
  }, [drawRef, mapRef, tempRoutePoints, onUpdateSegments]);

  const cancelDrawing = useCallback(() => {
    const draw = drawRef.current;
    if (draw) {
      const tempFeature = draw.getAll().features.find((f) => f.properties?.temp);
      if (tempFeature) draw.delete(tempFeature.id);
    }

    const map = mapRef.current;
    if (map) {
      tempRoutePoints.forEach((_, i) => {
        const pointId = `click-point-${i + 1}`;
        if (map.getLayer(pointId)) map.removeLayer(pointId);
        if (map.getSource(pointId)) map.removeSource(pointId);
      });
    }

    setIsDrawingMode(false);
    setTempRoutePoints([]);
    setShowRouteActions(false);
  }, [drawRef, mapRef, tempRoutePoints]);

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

    const addPoint = (lng: number, lat: number) => {
      if (!isDrawingMode) return;

      setTempRoutePoints((prev) => {
        let updated: [number, number][] = prev;
        if (prev.length === 0 && lastCoordRef.current) {
          updated = [lastCoordRef.current];
        }

        const newPoint: [number, number] = [lng, lat];
        const newPoints = [...updated, newPoint];

        const draw = drawRef.current;
        if (draw) {
          draw.getAll().features.filter((f) => f.properties?.temp).forEach((f) => draw.delete(f.id));

          if (newPoints.length >= 2) {
            draw.add({
              type: "Feature",
              properties: { temp: true },
              geometry: {
                type: "LineString",
                coordinates: newPoints,
              },
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
                  geometry: {
                    type: "Point",
                    coordinates: newPoint,
                  },
                  properties: null
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
        }

        return newPoints;
      });
    };

    const updatePreview = (lng: number, lat: number) => {
      if (!isDrawingMode || tempRoutePoints.length === 0) return;

      const previewCoords: [number, number][] = [...tempRoutePoints, [lng, lat]];
      const draw = drawRef.current;

      if (draw) {
        draw.getAll().features.filter((f) => f.properties?.temp).forEach((f) => draw.delete(f.id));

        draw.add({
          type: "Feature",
          properties: { temp: true },
          geometry: {
            type: "LineString",
            coordinates: previewCoords,
          },
        });
      }
    };

    const handleClick = (e: any) => {
      const { lng, lat } = e.lngLat;
      addPoint(lng, lat);
    };

    const handleMouseMove = (e: any) => {
      const { lng, lat } = e.lngLat;
      updatePreview(lng, lat);
    };

    const handleMapMove = () => {
      if (!isDrawingMode || tempRoutePoints.length === 0 || !isMobile) return;
      
      const center = map.getCenter();
      updatePreview(center.lng, center.lat);
    };

    if (isDrawingMode) {
      map.getCanvas().style.cursor = isMobile ? "" : "crosshair";
      
      if (isMobile) {
        // On mobile: preview
        map.on("move", handleMapMove);
      } else {
        // On desktop: click and preview
        map.on("click", handleClick);
        map.on("mousemove", handleMouseMove);
      }

      return () => {
        map.getCanvas().style.cursor = "";
        if (isMobile) {
          map.off("move", handleMapMove);
        } else {
          map.off("click", handleClick);
          map.off("mousemove", handleMouseMove);
        }
      };
    } else {
      map.getCanvas().style.cursor = "";
    }
  }, [isDrawingMode, mapRef, drawRef, lastCoordRef, tempRoutePoints, isMobile]);

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