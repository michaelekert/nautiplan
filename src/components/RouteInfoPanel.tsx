import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Waypoints } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Segment } from "@/types/passagePlan";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface RouteInfoPanelProps {
  segments: Segment[];
  drawRef: React.RefObject<MapboxDraw | null>;
  onClearAllSegments: () => void; 
}

export function RouteInfoPanel({ segments, drawRef, onClearAllSegments }: RouteInfoPanelProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const totalDistanceNm = segments.reduce((sum, seg) => sum + seg.distanceNm, 0);

  const getSegmentCoordinates = (segmentId: string) => {
    const draw = drawRef.current;
    if (!draw) return null;
    const data = draw.getAll();
    const feature = data.features.find((f) => String(f.id) === segmentId);
    if (!feature || feature.geometry.type !== "LineString") return null;
    const coords = feature.geometry.coordinates as [number, number][];
    return { start: coords[0], end: coords[coords.length - 1] };
  };

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

  if (segments.length === 0) return null;

  return (
    <div
      className="
        absolute
        top-0 right-0                  /* Mobile: top-right */
        md:top-4 md:left-1/2           /* Desktop: centered */
        md:-translate-x-1/2
        z-40
        w-[70%] md:w-2/3
        max-w-md
        px-0 md:px-4
      "
    >
      <div className="bg-slate-800/95 text-white md:rounded-lg border border-slate-700 shadow-xl overflow-hidden">

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <Waypoints className="text-blue-400" size={20} />
            <div>
              <div className="font-semibold text-lg">{totalDistanceNm.toFixed(1)} NM</div>
              <div className="text-xs text-slate-400">{t("Total route length")}</div>
            </div>
          </div>

          {isExpanded ? (
            <ChevronUp size={20} className="text-slate-400" />
          ) : (
            <ChevronDown size={20} className="text-slate-400" />
          )}
        </button>

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

            {segments.length > 0 && (
              <div className="flex justify-center mt-3">
                <Button
                  onClick={onClearAllSegments}
                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2 px-3 py-1 text-xs"
                >
                  <Trash className="w-4 h-4" />
                  {t("Clear all")}
                </Button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
