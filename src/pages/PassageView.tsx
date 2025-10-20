import { useEffect, useRef, useState } from "react";
import { Map, MapStyle, config } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import { WindLayer } from "@maptiler/weather";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BottomNavbar } from "@/components/BottomNavbar";

config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

interface Segment {
  id: string;
  distanceNm: number;
  speed: number;
  stopHours: number;
  timeHours: number;
  arrivalTime: Date;
}

export default function PassagePlan() {
  const mapRef = useRef<Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const windLayerRef = useRef<any>(null);

  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [currentTimeText, setCurrentTimeText] = useState("");
  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new Map({
      container: "map",
      style: MapStyle.BRIGHT,
      center: [2.3399, 48.8555],
      zoom: 5,
      maxZoom: 10,
    });
    mapRef.current = map;

    const windLayer = new WindLayer({ opacity: 0.1 });
    windLayerRef.current = windLayer;

    map.on("load", () => {
      map.addLayer(windLayer);

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: { line_string: true, trash: true },
        styles: [
          {
            id: "gl-draw-line",
            type: "line",
            filter: ["all", ["==", "$type", "LineString"]],
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#2232c5ff", "line-width": 3 },
          },
          {
            id: "gl-draw-vertex-halo-active",
            type: "circle",
            filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
            paint: { "circle-radius": 7, "circle-color": "#fff" },
          },
          {
            id: "gl-draw-vertex-active",
            type: "circle",
            filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
            paint: { "circle-radius": 4, "circle-color": "#22c55e" },
          },
        ],
      });

      drawRef.current = draw;
      map.addControl(draw);

      setTimeout(() => {
        const drawControls = document.querySelectorAll(".mapboxgl-ctrl-group.mapboxgl-ctrl");
        drawControls.forEach((elem) =>
          elem.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group")
        );
      }, 100);

      map.on("draw.create", updateSegments);
      map.on("draw.delete", updateSegments);
      map.on("draw.update", updateSegments);
    });

    windLayer.on("sourceReady", () => {
      const updateTime = () => {
        const date = windLayer.getAnimationTimeDate();
        setCurrentTimeText(date.toLocaleString());
      };
      updateTime();
      const interval = setInterval(async () => {
        await windLayer.reloadData();
        updateTime();
      }, 60 * 60 * 1000);
      return () => clearInterval(interval);
    });
  }, []);


  const updateSegments = () => {
    const draw = drawRef.current;
    const map = mapRef.current;
    if (!draw || !map) return;

    const data = draw.getAll();

    const oldSettings: Record<string, { speed: number; stopHours: number }> = {};
    segments.forEach((s) => {
      oldSettings[s.id] = { speed: s.speed, stopHours: s.stopHours };
    });

    let currentTime = new Date(startDate);
    const newSegments: Segment[] = [];

    data.features.forEach((f) => {
      if (f.geometry.type === "LineString") {
        const distanceKm = turf.length(f, { units: "kilometers" });
        const distanceNm = distanceKm / 1.852;

        const speed = oldSettings[f.id]?.speed || 10;
        const stopHours = oldSettings[f.id]?.stopHours || 0;
        const timeHours = distanceNm / speed;

        const arrivalTime = new Date(currentTime);
        arrivalTime.setHours(arrivalTime.getHours() + timeHours);

        newSegments.push({ id: f.id, distanceNm, speed, stopHours, timeHours, arrivalTime });

        currentTime = new Date(arrivalTime);
        currentTime.setHours(currentTime.getHours() + stopHours);
      }
    });

    setSegments(newSegments);
    updateLabelsOnMap(newSegments, data.features, map);
  };

  const updateLabelsOnMap = (segments: Segment[], features: any[], map: Map) => {
    if (map.getLayer("segment-labels")) map.removeLayer("segment-labels");
    if (map.getSource("segment-labels")) map.removeSource("segment-labels");

    const labelFeatures = features
      .filter((f) => f.geometry.type === "LineString")
      .map((f) => {
        const coords = f.geometry.coordinates as [number, number][];
        const midpoint = turf.along(turf.lineString(coords), turf.length(f) / 2);
        const seg = segments.find((s) => s.id === f.id);
        const label = `${seg?.distanceNm.toFixed(1)} NM · ${seg?.timeHours.toFixed(1)} h · Postój: ${seg?.stopHours} h`;
        return {
          type: "Feature" as const,
          geometry: midpoint.geometry,
          properties: { label },
        };
      });

    map.addSource("segment-labels", {
      type: "geojson",
      data: { type: "FeatureCollection", features: labelFeatures },
    });

    map.addLayer({
      id: "segment-labels",
      type: "symbol",
      source: "segment-labels",
      layout: {
        "text-field": ["get", "label"],
        "text-size": 12,
        "text-offset": [0, 1],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#fff",
        "text-halo-color": "#000",
        "text-halo-width": 1.5,
      },
    });
  };

  const handleSpeedChange = (id: string, newSpeed: number) => {
    setSegments((prev) => recalcSegments(prev.map((s) =>
      s.id === id ? { ...s, speed: newSpeed } : s
    )));
  };

  const handleStopChange = (id: string, newStop: number) => {
    setSegments((prev) => recalcSegments(prev.map((s) =>
      s.id === id ? { ...s, stopHours: newStop } : s
    )));
  };

  const recalcSegments = (segs: Segment[]) => {
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
    if (map && draw) updateLabelsOnMap(updated, draw.getAll().features, map);

    return updated;
  };

  useEffect(() => {
    if (segments.length > 0) setSegments(recalcSegments(segments));
  }, [startDate]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 text-white mb-20">
      <div className="w-full max-w-6xl bg-slate-800 p-4 rounded-lg space-y-4">
        <Label htmlFor="startDate">📅 Data i godzina wypłynięcia</Label>
        <Input
          id="startDate"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mb-2"
        />
      </div>

      <div id="map" className="w-full max-w-6xl h-[60vh] rounded-lg shadow-lg" />

      <div className="w-full max-w-6xl bg-slate-800 p-4 rounded-lg space-y-4">
        <div className="flex justify-between text-sm text-slate-300 border-b border-slate-700 pb-2">
          <span>🕓 Aktualna godzina danych wiatru:</span>
          <span>{currentTimeText}</span>
        </div>

        {segments.length === 0 ? (
          <p className="text-slate-400 text-sm">
            ✏️ Kliknij przycisk "Draw line" na mapie, by narysować trasę.
          </p>
        ) : (
          <ul className="space-y-3">
            {segments.map((s, i) => (
              <li
                key={s.id}
                className="p-3 bg-slate-700 rounded-md flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-sm"
              >
                <span>Odcinek {i + 1}</span>
                <div className="flex gap-2 items-center flex-wrap">
                  <span>
                    Dystans: {s.distanceNm.toFixed(2)} NM · Czas: {s.timeHours.toFixed(2)} h
                  </span>
                  <Label>Prędkość (węzły)</Label>
                  <Input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={s.speed}
                    onChange={(e) => handleSpeedChange(s.id, Number(e.target.value))}
                    className="w-24"
                  />
                  <Label>Postój (h)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    value={s.stopHours}
                    onChange={(e) => handleStopChange(s.id, Number(e.target.value))}
                    className="w-24"
                  />
                  <span>• Dopłynięcie: {s.arrivalTime.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
}
