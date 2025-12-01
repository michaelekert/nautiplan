import { useState, useMemo, useEffect, useCallback } from "react";
import { Waypoints, LocateFixed, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Segment } from "@/types/passagePlan";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Button } from "@/components/ui/button";
import distance from "@turf/distance";
import { point } from "@turf/helpers";

interface RouteInfoPanelProps {
  segments: Segment[];
  drawRef: React.RefObject<MapboxDraw | null>;
  tempRoutePoints: [number, number][];
  mapRef: React.RefObject<any>;
  isDrawingMode: boolean;
  defaultSpeed: number;
  onClearAllSegments: () => void;
}

export function RouteInfoPanel({
  segments,
  drawRef,
  tempRoutePoints,
  mapRef,
  isDrawingMode,
  defaultSpeed,
  onClearAllSegments,
}: RouteInfoPanelProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [cursorPos, setCursorPos] = useState<[number, number] | null>(null);

  const [distanceMode, setDistanceMode] = useState<"total" | "last">("total");
  const toggleDistanceMode = () =>
    setDistanceMode((prev) => (prev === "total" ? "last" : "total"));

  const totalDistanceNm = useMemo(
    () => segments.reduce((sum, seg) => sum + seg.distanceNm, 0),
    [segments]
  );

  const getSegmentCoordinates = useCallback(
    (segmentId: string) => {
      const draw = drawRef.current;
      if (!draw) return null;
      const feature = draw.getAll().features.find((f) => String(f.id) === segmentId);
      if (!feature || feature.geometry.type !== "LineString") return null;
      const coords = feature.geometry.coordinates as [number, number][];
      return { start: coords[0], end: coords[coords.length - 1] };
    },
    [drawRef]
  );

  const points = useMemo(() => {
    const arr: { name: string; lat: number; lon: number }[] = [];
    segments.forEach((segment) => {
      const coords = getSegmentCoordinates(segment.id);
      if (!coords) return;
      arr.push({ name: segment.startName, lat: coords.start[1], lon: coords.start[0] });
      arr.push({ name: segment.endName, lat: coords.end[1], lon: coords.end[0] });
    });

    const unique = new Map();
    arr.forEach((p) => unique.set(p.name, p));
    return [...unique.values()];
  }, [segments, getSegmentCoordinates]);

  const lastSegmentDistanceNm = useMemo(() => {
    if (!isDrawingMode || !cursorPos) return 0;

    let lastPoint: [number, number] | null = null;
    let tempDistance = 0;

    if (tempRoutePoints.length > 1) {
      for (let i = 0; i < tempRoutePoints.length - 1; i++) {
        const meters = distance(
          point(tempRoutePoints[i]),
          point(tempRoutePoints[i + 1]),
          { units: "meters" }
        );
        tempDistance += meters / 1852;
      }
      lastPoint = tempRoutePoints[tempRoutePoints.length - 1];
    } else if (tempRoutePoints.length === 1) {
      lastPoint = tempRoutePoints[0];
    } else if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      const coords = getSegmentCoordinates(lastSegment.id);
      if (coords) lastPoint = coords.end;
    }

    if (!lastPoint) return 0;

    const metersToCursor = distance(
      point([lastPoint[0], lastPoint[1]]),
      point([cursorPos[0], cursorPos[1]]),
      { units: "meters" }
    );

    return tempDistance + metersToCursor / 1852;
  }, [tempRoutePoints, cursorPos, segments, isDrawingMode, getSegmentCoordinates]);

  const totalDistanceWithCursor = useMemo(
    () => totalDistanceNm + lastSegmentDistanceNm,
    [totalDistanceNm, lastSegmentDistanceNm]
  );

  const timeToCursorHours = useMemo(() => {
    if (!defaultSpeed || defaultSpeed <= 0) return 0;
    return lastSegmentDistanceNm / defaultSpeed;
  }, [lastSegmentDistanceNm, defaultSpeed]);

  const timeToCursorFormatted = useMemo(() => {
    const totalMinutes = Math.round(timeToCursorHours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  }, [timeToCursorHours]);

  const displayedDistanceNm =
    distanceMode === "total" ? totalDistanceWithCursor : lastSegmentDistanceNm;

  const distanceDescription =
    distanceMode === "total"
      ? "Total route length"
      : `from last stop, ETA ${timeToCursorFormatted}`;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMouseMove = (e: any) => {
      if (isDrawingMode) setCursorPos([e.lngLat.lng, e.lngLat.lat]);
    };

    const handleMapMove = () => {
      if (isDrawingMode) {
        const center = map.getCenter();
        setCursorPos([center.lng, center.lat]);
      }
    };

    map.on("mousemove", handleMouseMove);
    map.on("move", handleMapMove);

    return () => {
      map.off("mousemove", handleMouseMove);
      map.off("move", handleMapMove);
    };
  }, [mapRef, isDrawingMode]);

  useEffect(() => {
    if (!isDrawingMode) setCursorPos(null);
  }, [isDrawingMode]);

  if (segments.length === 0 && tempRoutePoints.length === 0) return null;

  return (
    <div className="absolute top-0 right-0 md:top-4 md:left-1/2 md:-translate-x-1/2 z-40 w-[100%] md:w-2/3 max-w-md px-0 md:px-4">
      <div className="bg-slate-800/95 text-white md:rounded-lg border border-slate-700 shadow-xl overflow-hidden">
      <div className="w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Waypoints className="text-blue-400" size={30} />
          <div className="flex flex-col cursor-pointer" onClick={toggleDistanceMode}>
            <div className="font-semibold text-sm">{displayedDistanceNm.toFixed(1)} NM</div>
            <div className="text-[9px] text-slate-400">{distanceDescription}</div>
          </div>
        </div>

        {segments.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center gap-1 py-2 px-2 w-11 h-11 text-center"
            >
              <LocateFixed className="h-3 w-3" />
              <span className="text-[5px] truncate">Show coords</span>
            </Button>
            <Button
              onClick={onClearAllSegments}
              className="bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center gap-1 py-2 px-2 w-11 h-11 text-center"
            >
              <Trash className="h-3 w-3" />
              <span className="text-[5px] truncate">{t("Clear all")}</span>
            </Button>
          </div>
        )}
      </div>


        {isExpanded && (
          <div className="border-t border-slate-700 max-h-[60vh] overflow-y-auto p-3 space-y-2">
            <table className="w-full text-xs text-left text-slate-300 font-mono">
              <thead className="text-slate-500 border-b border-slate-700">
                <tr>
                  <th className="py-1">{t("Name")}</th>
                  <th className="py-1">Lat</th>
                  <th className="py-1">Lon</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p, i) => (
                  <tr key={i} className="border-b border-slate-700/40">
                    <td className="py-1">{p.name}</td>
                    <td className="py-1">{p.lat.toFixed(5)}</td>
                    <td className="py-1">{p.lon.toFixed(5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
