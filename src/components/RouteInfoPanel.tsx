import { useState, useMemo, useEffect } from "react";
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
  onClearAllSegments: () => void;
}

export function RouteInfoPanel({
  segments,
  drawRef,
  tempRoutePoints,
  mapRef,
  isDrawingMode,
  onClearAllSegments,
}: RouteInfoPanelProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [cursorPos, setCursorPos] = useState<[number, number] | null>(null);

  // całkowita długość istniejących segmentów
  const totalDistanceNm = useMemo(() => segments.reduce((sum, seg) => sum + seg.distanceNm, 0), [segments]);

  // helper do pobrania współrzędnych segmentu z drawRef
  const getSegmentCoordinates = (segmentId: string) => {
    const draw = drawRef.current;
    if (!draw) return null;
    const feature = draw.getAll().features.find((f) => String(f.id) === segmentId);
    if (!feature || feature.geometry.type !== "LineString") return null;
    const coords = feature.geometry.coordinates as [number, number][];
    return { start: coords[0], end: coords[coords.length - 1] };
  };

  // lista unikalnych punktów do tabeli
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
  }, [segments, drawRef]);

  // dystans "na żywo" od ostatniego punktu temp do kursora
  const liveDistanceNm = useMemo(() => {
    // Jeśli nie jesteśmy w trybie rysowania, pokaż tylko sumę segmentów
    if (!isDrawingMode || !cursorPos) return totalDistanceNm;
    
    let lastPoint: [number, number] | null = null;
    let tempDistance = 0;
    
    // Jeśli są temp points i więcej niż 1, oblicz dystans między nimi
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
    }
    // Jeśli jest tylko 1 temp point (tryb mobile po dodaniu punktu)
    else if (tempRoutePoints.length === 1) {
      lastPoint = tempRoutePoints[0];
    }
    // Jeśli nie ma temp points, ale są segmenty
    else if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      const coords = getSegmentCoordinates(lastSegment.id);
      if (coords) {
        lastPoint = coords.end;
      }
    }
    
    // Jeśli mamy punkt bazowy, oblicz dystans do kursora
    if (lastPoint) {
      const meters = distance(
        point([lastPoint[0], lastPoint[1]]), 
        point([cursorPos[0], cursorPos[1]]), 
        { units: "meters" }
      );
      return totalDistanceNm + tempDistance + meters / 1852;
    }
    
    return totalDistanceNm + tempDistance;
  }, [totalDistanceNm, tempRoutePoints, cursorPos, segments, isDrawingMode]);

  // listener kursora
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMouseMove = (e: any) => setCursorPos([e.lngLat.lng, e.lngLat.lat]);
    const handleMapMove = () => {
      const center = map.getCenter();
      setCursorPos([center.lng, center.lat]);
    };

    map.on("mousemove", handleMouseMove);
    map.on("move", handleMapMove);

    return () => {
      map.off("mousemove", handleMouseMove);
      map.off("move", handleMapMove);
    };
  }, [mapRef]);

  // Pokaż panel jeśli są segmenty LUB temp points (tryb rysowania)
  if (segments.length === 0 && tempRoutePoints.length === 0) return null;

  return (
    <div className="absolute top-0 right-0 md:top-4 md:left-1/2 md:-translate-x-1/2 z-40 w-[70%] md:w-2/3 max-w-md px-0 md:px-4">
      <div className="bg-slate-800/95 text-white md:rounded-lg border border-slate-700 shadow-xl overflow-hidden">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Waypoints className="text-blue-400" size={20} />
            <div>
              <div className="font-semibold text-lg">
                {liveDistanceNm > 0 ? liveDistanceNm.toFixed(1) : "0.0"} NM
              </div>
              <div className="text-xs text-slate-400">{t("Total route length")}</div>
            </div>

            {segments.length > 0 && (
              <Button
                onClick={onClearAllSegments}
                className="bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center gap-1 py-2 px-2 w-11 h-11 text-center"
              >
                <Trash className="h-3 w-3" />
                <span className="text-[5px] truncate">{t("Clear all")}</span>
              </Button>
            )}

            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center gap-1 py-2 px-2 w-11 h-11 text-center"
            >
              <LocateFixed className="h-3 w-3" />
              <span className="text-[5px] truncate">Show coords</span>
            </Button>
          </div>
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