import { useEffect, useMemo, useState } from "react";
import * as turf from "@turf/turf";
import { Map } from "@maptiler/sdk";

interface Props {
  mapRef: React.MutableRefObject<Map | null>;
  windLayerRef: React.MutableRefObject<any>;
  drawRef: any;
  segments: import("@/types/passagePlan").Segment[];
  startDate: string;
  setTime: (date: Date) => void;
  getWindAt: (
    lon: number,
    lat: number,
    date: Date
  ) => Promise<{ speed: number; dir: number } | null>;
}

export function PassagePlanTimeline({
  mapRef,
  windLayerRef,
  drawRef,
  segments,
  startDate,
  setTime,
  getWindAt,
}: Props) {
  const [simTime, setSimTime] = useState<Date | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windInfo, setWindInfo] = useState<{ speed: number; dir: number } | null>(
    null
  );


  const totalDistance = useMemo(
    () => segments.reduce((acc, s) => acc + (s.distanceNm || 0), 0),
    [segments]
  );


  const totalTravelTime = useMemo(() => {
    return segments.reduce((acc, s) => {
      const travelTime = s.speed > 0 ? s.distanceNm / s.speed : 0;
      return acc + travelTime + (s.stopHours || 0);
    }, 0);
  }, [segments]);


  const stopPositions = useMemo(() => {
    if (totalDistance === 0) return [];
    let cumulative = 0;
    const stops: { name: string; percentage: number }[] = [];

    for (const seg of segments) {
      stops.push({
        name: seg.startName || "Start",
        percentage: (cumulative / totalDistance) * 100,
      });
      cumulative += seg.distanceNm || 0;
    }

    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      stops.push({
        name: last.endName || "End",
        percentage: 100,
      });
    }

    return stops;
  }, [segments, totalDistance]);

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
        const progress = travelTime > 0 ? elapsed / travelTime : 0;
        const traveled = progress * (seg.distanceNm || 0);
        const point = turf.along(line, traveled, { units: "nauticalmiles" });
        return point.geometry.coordinates;
      }

      elapsed -= travelTime + (seg.stopHours || 0);
    }

    return null;
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !simTime) return;

    const id = "sim-position";
    const pos = getPositionAtTime(simTime);

    if (!pos) {
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(id)) map.removeSource(id);
      return;
    }

    const feature = {
      type: "Feature",
      geometry: { type: "Point", coordinates: pos },
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
    getWindAt(lon, lat, simTime).then((wind) =>
      setWindInfo(wind ? { speed: wind.speed, dir: wind.dir } : null)
    );
  }, [simTime, segments]);


  useEffect(() => {
    if (!isPlaying || segments.length === 0 || totalTravelTime === 0) return;

    const interval = setInterval(() => {
      setSimTime((prev) => {
        if (!prev) return new Date(startDate);
        const next = new Date(prev.getTime() + 60 * 1000); // +1 min
        const elapsed =
          (next.getTime() - new Date(startDate).getTime()) / 3600000;

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
    const elapsed =
      (simTime.getTime() - new Date(startDate).getTime()) / 3600000;
    return Math.min(100, Math.max(0, (elapsed / totalTravelTime) * 100));
  }, [simTime, totalTravelTime, startDate]);

  return (
    <div className="w-full max-w-4xl bg-slate-800 p-4 rounded-lg shadow-lg mt-4 space-y-4">
      <div className="flex justify-between items-center text-sm text-gray-300">
        <span>{new Date(startDate).toLocaleString()}</span>
        <span>
          {simTime ? simTime.toLocaleString() : "—"} ({progress.toFixed(1)}%)
        </span>
      </div>

      <div className="text-sm text-center text-gray-300">
        💨{" "}
        {windInfo
          ? `${windInfo.speed.toFixed(1)} m/s (${(windInfo.speed * 1.94384).toFixed(
              1
            )} kn) · ${Math.round(windInfo.dir)}°`
          : "Brak danych wiatru"}
      </div>

      <div className="relative pt-6 pb-2">
        <div className="absolute top-0 left-0 right-0 h-6">
          {stopPositions.map((stop, idx) => (
            <div
              key={idx}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${stop.percentage}%` }}
            >
              <div className="w-0.5 h-4 bg-slate-400 mx-auto"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-slate-700 -mt-1 mx-auto"></div>
              <div className="text-[10px] text-slate-300 mt-1 whitespace-nowrap absolute left-1/2 transform -translate-x-1/2">
                {stop.name}
              </div>
            </div>
          ))}
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={(e) => {
            const percent = parseFloat(e.target.value);
            const newHours = (percent / 100) * totalTravelTime;
            setSimTime(
              new Date(new Date(startDate).getTime() + newHours * 3600 * 1000)
            );
          }}
          className="w-full accent-green-400 mt-8"
          style={{
            background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${progress}%, #475569 ${progress}%, #475569 100%)`,
          }}
        />
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm font-semibold"
        >
          {isPlaying ? "⏸ Pauza" : "▶ Start"}
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            setSimTime(new Date(startDate));
          }}
          className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
