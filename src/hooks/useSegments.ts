import { useState, useRef, useEffect, useCallback } from "react";
import { Map } from "@maptiler/sdk";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import type { Segment } from "../types/passagePlan";
import { getPlaceName } from "../services/geocoding";
import { updateLabelsOnMap } from "../utils/mapLabels";

export function useSegments(
  mapRef: React.RefObject<Map | null>,
  drawRef: React.RefObject<MapboxDraw | null>,
  startDate: string,
  defaultSpeed: number
) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const lastCoordRef = useRef<[number, number] | null>(null);
  const defaultSpeedRef = useRef<number>(defaultSpeed);
  const segmentsRef = useRef<Segment[]>([]);

  useEffect(() => {
    defaultSpeedRef.current = defaultSpeed;
  }, [defaultSpeed]);

  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  const recalcSegments = useCallback(
    (segs: Segment[]) => {
      let currentTime = new Date(startDate);
      const updated = segs.map((s) => {
        const timeHours = s.distanceNm / s.speed;
        const arrivalTime = new Date(currentTime);
        arrivalTime.setHours(arrivalTime.getHours() + timeHours);
        currentTime = new Date(arrivalTime);
        currentTime.setHours(currentTime.getHours() + s.stopHours);
        return { ...s, timeHours, arrivalTime };
      });

      const map = mapRef.current;
      const draw = drawRef.current;
      if (map && draw) {
        updateLabelsOnMap(updated, draw.getAll().features, map);
      }
      return updated;
    },
    [startDate, mapRef, drawRef]
  );

  const updateSegments = useCallback(async () => {
    const draw = drawRef.current;
    const map = mapRef.current;
    if (!draw || !map) return;

    const data = draw.getAll();
    let currentTime = new Date(startDate);
    const prevSegments = segmentsRef.current;
    const newSegments: Segment[] = [];

    for (const f of data.features) {
      if (f.geometry.type !== "LineString") continue;
      if (f.properties?.temp) continue;

      const coords = f.geometry.coordinates as [number, number][];
      const start = coords[0];
      const end = coords[coords.length - 1];
      const existingSegment = prevSegments.find((s) => s.id === String(f.id));

      let autoStartName = existingSegment?.autoStartName;
      let autoEndName = existingSegment?.autoEndName;

      if (!existingSegment) {
        const [startName, endName] = await Promise.all([
          getPlaceName(start),
          getPlaceName(end),
        ]);
        autoStartName = startName;
        autoEndName = endName;
      }

      const startName =
        existingSegment?.startName ?? autoStartName ?? "Nieznane miejsce";
      const endName =
        existingSegment?.endName ?? autoEndName ?? "Nieznane miejsce";
      const distanceKm = turf.length(f, { units: "kilometers" });
      const distanceNm = distanceKm / 1.852;
      const speed = existingSegment?.speed ?? defaultSpeedRef.current;
      const stopHours = existingSegment?.stopHours ?? 0;
      const timeHours = distanceNm / speed;
      const arrivalTime = new Date(currentTime);
      arrivalTime.setHours(arrivalTime.getHours() + timeHours);

      newSegments.push({
        id: String(f.id),
        startName,
        endName,
        autoStartName: autoStartName ?? "Nieznane miejsce",
        autoEndName: autoEndName ?? "Nieznane miejsce",
        distanceNm,
        speed,
        stopHours,
        timeHours,
        arrivalTime,
      });

      currentTime = new Date(arrivalTime);
      currentTime.setHours(currentTime.getHours() + stopHours);
    }

    setSegments(newSegments);

    const allFeatures = draw.getAll().features;
    const lastLine = allFeatures
      .filter((f) => f.geometry.type === "LineString")
      .at(-1) as
      | { geometry: { type: "LineString"; coordinates: [number, number][] } }
      | undefined;

    lastCoordRef.current = lastLine?.geometry.coordinates.at(-1) ?? null;

    updateLabelsOnMap(newSegments, data.features, map);
  }, [drawRef, mapRef, startDate]);

  const handleSpeedChange = useCallback((id: string, newSpeed: number) => {
    setSegments((prev) =>
      recalcSegments(prev.map((s) => (s.id === id ? { ...s, speed: newSpeed } : s)))
    );
  }, [recalcSegments]);

  const handleStopChange = useCallback((id: string, newStop: number) => {
    setSegments((prev) =>
      recalcSegments(
        prev.map((s) => (s.id === id ? { ...s, stopHours: newStop } : s))
      )
    );
  }, [recalcSegments]);

const handleNameChange = useCallback(
  (id: string, field: "startName" | "endName", value: string) => {
    setSegments((prev) => {
      const updated = prev.map((seg) =>
        seg.id === id ? { ...seg, [field]: value } : seg
      );

      try {
        const map = mapRef.current;
        const draw = drawRef.current;
        if (map && draw && typeof draw.getAll === "function") {
          const data = draw.getAll();
          if (data?.features) {
            updateLabelsOnMap(updated, data.features, map);
          }
        }
      } catch (err) {
        console.warn("Nie udało się odświeżyć etykiet:", err);
      }

      return updated;
    });
  },
  [mapRef, drawRef]
);


  useEffect(() => {
    if (segments.length > 0) {
      setSegments(recalcSegments(segments));
    }
  }, [startDate]);

  return {
    segments,
    setSegments,
    lastCoordRef,
    updateSegments,
    handleSpeedChange,
    handleStopChange,
    handleNameChange,
    recalcSegments,
  };
}