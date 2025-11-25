import { useEffect, useMemo, useState } from "react";
import * as turf from "@turf/turf";
import { Map } from "@maptiler/sdk";

interface Props {
  mapRef: React.MutableRefObject<Map | null>;
  drawRef: any;
  segments: import("@/types/passagePlan").Segment[];
  startDate: string;
  setTime: (date: Date) => void;
  getWindAt: (
    lon: number,
    lat: number,
    date: Date
  ) => Promise<{ speed: number; dir: number } | null>;
  onWindInfoChange?: (wind: { speed: number; dir: number } | null) => void;
}

export function PassagePlanTimeline({
  mapRef,
  drawRef,
  segments,
  startDate,
  setTime,
  getWindAt,
  onWindInfoChange,
}: Props) {
  const [simTime, setSimTime] = useState<Date | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [_windInfo, setWindInfo] = useState<{ speed: number; dir: number } | null>(null);

  const totalTravelTime = useMemo(() => {
    return segments.reduce((acc, s) => {
      const travelTime = s.speed > 0 ? s.distanceNm / s.speed : 0;
      return acc + travelTime + (s.stopHours || 0);
    }, 0);
  }, [segments]);

  const getPositionAtTime = (simDate: Date) => {
    const start = new Date(startDate);
    let elapsed = (simDate.getTime() - start.getTime()) / 3600000;
    const draw = drawRef?.current;
    if (!draw) return null;

    for (const seg of segments) {
      const feature = draw.get(seg.id);
      if (!feature) continue;

      const coords = feature.geometry.coordinates as [number, number][];
      const line = turf.lineString(coords);
      const travelTime = seg.speed > 0 ? seg.distanceNm / seg.speed : 0;

      if (elapsed <= travelTime) {
        const traveled = travelTime > 0 ? (elapsed / travelTime) * (seg.distanceNm || 0) : 0;
        const point = turf.along(line, traveled, { units: "nauticalmiles" });
        return point.geometry.coordinates;
      }

      elapsed -= travelTime + (seg.stopHours || 0);
    }

    return null;
  };

  // POPRAWKA: Czyść czerwoną kropkę gdy nie ma segmentów
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const id = "sim-position";

    if (segments.length === 0) {
      if (map.getLayer(id)) {
        try {
          map.removeLayer(id);
        } catch (e) {
          console.error("Error removing layer:", e);
        }
      }
      if (map.getSource(id)) {
        try {
          map.removeSource(id);
        } catch (e) {
          console.error("Error removing source:", e);
        }
      }
      setSimTime(null);
      setWindInfo(null);
      onWindInfoChange?.(null);
    }
  }, [segments, mapRef, onWindInfoChange]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !simTime || segments.length === 0) return;

    const id = "sim-position";
    const pos = getPositionAtTime(simTime);

    if (!pos) {
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(id)) map.removeSource(id);
      setWindInfo(null);
      onWindInfoChange?.(null);
      return;
    }

    const feature: GeoJSON.Feature<GeoJSON.Point> = {
      type: "Feature",
      geometry: { type: "Point", coordinates: pos as [number, number] },
      properties: {},
    };

    if (map.getSource(id)) {
      (map.getSource(id) as any).setData(feature);
    } else {
      map.addSource(id, { type: "geojson", data: feature });
      map.addLayer({
        id,
        type: "circle",
        source: id,
        paint: {
          "circle-radius": 8,
          "circle-color": "#f87171",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });
    }

    setTime(simTime);

    const [lon, lat] = pos;
    getWindAt(lon, lat, simTime).then((wind) => {
      const info = wind ? { speed: wind.speed, dir: wind.dir } : null;
      setWindInfo(info);
      onWindInfoChange?.(info);
    });
  }, [simTime, segments, startDate, setTime, getWindAt, onWindInfoChange, mapRef, drawRef]);

  useEffect(() => {
    if (!isPlaying || segments.length === 0 || totalTravelTime === 0) return;

    const interval = setInterval(() => {
      setSimTime((prev) => {
        if (!prev) return new Date(startDate);
        const next = new Date(prev.getTime() + 60 * 1000);
        const elapsed = (next.getTime() - new Date(startDate).getTime()) / 3600000;
        if (elapsed >= totalTravelTime) {
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isPlaying, startDate, totalTravelTime, segments]);

  const progress = useMemo(() => {
    if (!simTime || totalTravelTime === 0) return 0;
    const elapsed = (simTime.getTime() - new Date(startDate).getTime()) / 3600000;
    return Math.min(100, Math.max(0, (elapsed / totalTravelTime) * 100));
  }, [simTime, totalTravelTime, startDate]);

  if (segments.length === 0) return null;

  return (
    <>
      {/* MOBILE*/}
      <div
        className="
          flex md:hidden items-center gap-2 w-[90%] max-w-md
          absolute bottom-[35px] left-1/2 -translate-x-1/2 z-50
          bg-slate-900/80 backdrop-blur-md p-2 rounded-xl shadow-lg text-gray-200
        "
      >
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="px-2 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={(e) => {
            const percent = parseFloat(e.target.value);
            const newHours = (percent / 100) * totalTravelTime;
            setSimTime(new Date(new Date(startDate).getTime() + newHours * 3600 * 1000));
          }}
          className="flex-1 accent-green-400 h-1 rounded"
          style={{
            background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${progress}%, #475569 ${progress}%, #475569 100%)`,
          }}
        />

        <button
          onClick={() => {
            setIsPlaying(false);
            setSimTime(new Date(startDate));
          }}
          className="px-2 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-xs"
        >
          🔄
        </button>
      </div>

      {/* DESKTOP */}
      <div
        className="
          hidden md:flex flex-col items-center gap-2
          absolute bottom-25 left-1/2 -translate-x-1/2 z-50
          w-1/2 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl shadow-lg
          text-gray-200
        "
      >
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="px-2 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs"
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => {
              const percent = parseFloat(e.target.value);
              const newHours = (percent / 100) * totalTravelTime;
              setSimTime(new Date(new Date(startDate).getTime() + newHours * 3600 * 1000));
            }}
            className="flex-1 accent-green-400 h-1 rounded"
            style={{
              background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${progress}%, #475569 ${progress}%, #475569 100%)`,
            }}
          />

          <button
            onClick={() => {
              setIsPlaying(false);
              setSimTime(new Date(startDate));
            }}
            className="px-2 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-xs"
          >
            🔄
          </button>
        </div>
      </div>
    </>
  );
}