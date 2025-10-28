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
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

interface Segment {
  id: string;
  name?: string;
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
  const [segments, setSegments] = useState<Segment[]>([]);
  const [defaultSpeed, setDefaultSpeed] = useState(5);
  const defaultSpeedRef = useRef(defaultSpeed);

  useEffect(() => {
    defaultSpeedRef.current = defaultSpeed;
  }, [defaultSpeed]);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new Map({
      container: "map",
      style: MapStyle.BRIGHT,
      center: [18.6466, 54.3520],
      zoom: 5,
      maxZoom: 10,
    });
    mapRef.current = map;

    const windLayer = new WindLayer({ opacity: 0.1 }) as any;
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
        console.log(date.toLocaleString());
      };
      updateTime();
      const interval = setInterval(async () => {
        await windLayer.reloadData();
        updateTime();
      }, 60 * 60 * 1000);
      return () => clearInterval(interval);
    });
  }, []);

  async function getPlaceName([lon, lat]: [number, number]): Promise<string> {
  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
  const url = `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data?.features?.length) return "Nieznane miejsce";

  const place =
    data.features.find((f: any) =>
      f.place_type?.includes("municipal_district")
    ) ||
    data.features.find((f: any) =>
      f.place_type?.includes("region")
    ) ||
    data.features[3];

    return place.text || place.place_name || "Nieznane miejsce";
  } catch (e) {
    console.error("Błąd reverse geocodingu:", e);
    return "Nieznane miejsce";
  }
}


const updateSegments = async () => {
  const draw = drawRef.current;
  const map = mapRef.current;
  if (!draw || !map) return;

  const data = draw.getAll();
  let currentTime = new Date(startDate);
  const newSegments: Segment[] = [];

  for (const f of data.features) {
    if (f.geometry.type === "LineString") {
      const coords = f.geometry.coordinates as [number, number][];
      const start = coords[0];
      const end = coords[coords.length - 1];

      const [startName, endName] = await Promise.all([
        getPlaceName(start),
        getPlaceName(end),
      ]);

      const distanceKm = turf.length(f, { units: "kilometers" });
      const distanceNm = distanceKm / 1.852;

      const speed = defaultSpeedRef.current;
      const stopHours = 0;
      const timeHours = distanceNm / speed;

      const arrivalTime = new Date(currentTime);
      arrivalTime.setHours(arrivalTime.getHours() + timeHours);

      newSegments.push({
        id: String(f.id),
        name: `${startName} → ${endName}`,
        distanceNm,
        speed,
        stopHours,
        timeHours,
        arrivalTime,
      });

      currentTime = new Date(arrivalTime);
      currentTime.setHours(currentTime.getHours() + stopHours);
    }
  }

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
        const label = `${seg?.distanceNm.toFixed(1)} NM · ${seg?.timeHours.toFixed(1)} h`;
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
    <div className="flex flex-col items-center gap-6 p-0 md:p-6 text-white mb-20">
      <div id="map" className="w-full h-[90dvh] md:h-[60dvh] max-w-6xl overscroll-none overflow-hidden" />
      <div className="hidden md:block w-full max-w-6xl bg-slate-800 p-6 rounded-lg space-y-6 shadow-lg">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <Label htmlFor="startDate" className="mb-1 font-medium text-slate-200">
              📅 Data i godzina wypłynięcia
            </Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-600 bg-slate-900 text-white"
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="defaultSpeed" className="mb-1 font-medium text-slate-200">
              ⚓ Domyślna prędkość (węzły)
            </Label>
            <Input
              id="defaultSpeed"
              type="number"
              min={0.1}
              step={0.1}
              value={defaultSpeed}
              onChange={(e) => setDefaultSpeed(Number(e.target.value))}
              className="rounded-lg border border-slate-600 bg-slate-900 text-white"
            />
          </div>
        </div>


        {segments.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">
            ✏️ Kliknij przycisk „Draw line” na mapie, by narysować trasę.
          </p>
        ) : (
          <ul className="space-y-4">
            {segments.map((s, i) => (
              <li
                key={s.id}
                className="p-4 bg-slate-700 rounded-lg flex flex-col gap-3 shadow-md"
              >
                <div className="flex flex-wrap justify-between items-center">
                  <span className="font-medium text-white">
                    {s.name || `Odcinek ${i + 1}`}
                  </span>
                  <span className="text-slate-300 text-sm">
                    Dystans: {s.distanceNm.toFixed(2)} NM · Czas: {s.timeHours.toFixed(2)} h
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <div className="flex flex-col">
                    <Label className="text-slate-200 text-sm">Prędkość (węzły)</Label>
                    <Input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={s.speed}
                      onChange={(e) => handleSpeedChange(s.id, Number(e.target.value))}
                      className="rounded-lg border border-slate-600 bg-slate-900 text-white"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label className="text-slate-200 text-sm">Postój (h)</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      value={s.stopHours}
                      onChange={(e) => handleStopChange(s.id, Number(e.target.value))}
                      className="rounded-lg border border-slate-600 bg-slate-900 text-white"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-2 flex flex-col justify-end">
                    <Label className="text-slate-200 text-sm mb-1">Przewidywany czas dopłynięcia</Label>
                    <div className="text-slate-300 text-sm">
                      {s.arrivalTime.toLocaleString()}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Drawer>
        <DrawerTrigger className="md:hidden w-full max-w-6xl absolute left-1/2 bottom-1/8 -translate-x-1/2 -translate-y-1/2" asChild>
          <Button className="w-1/2">Otwórz Panel Planowania</Button>
        </DrawerTrigger>
        <DrawerContent className="md:hidden w-full max-w-full bg-slate-800 text-white p-6 top-0">
          <DrawerHeader>
            <DrawerTitle className="text-white">⚓ Ustawienia trasy</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-6 mt-4 overflow-y-auto max-h-[80vh]">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <Label htmlFor="startDate" className="mb-2">📅 Data i godzina wypłynięcia</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="defaultSpeed" className="mb-2">⚓ Domyślna prędkość (węzły)</Label>
                <Input
                  id="defaultSpeed"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={defaultSpeed}
                  onChange={(e) => setDefaultSpeed(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {segments.length === 0 ? (
              <p className="text-slate-400 text-sm">
                ✏️ Narysuj trasę na mapie, aby ustawić segmenty.
              </p>
            ) : (
              segments.map((s, i) => (
                <div
                  key={s.id}
                  className="p-3 bg-slate-700 rounded-md flex flex-col gap-2"
                >
                  <span className="font-medium">{s.name || `Odcinek ${i + 1}`}</span>
                  <span className="text-sm text-slate-300">
                    Dystans: {s.distanceNm.toFixed(2)} NM · Czas:{" "}
                    {s.timeHours.toFixed(2)} h
                  </span>

                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex flex-col">
                      <Label>Prędkość (węzły)</Label>
                      <Input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={s.speed}
                        onChange={(e) =>
                          handleSpeedChange(s.id, Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label>Postój (h)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.1}
                        value={s.stopHours}
                        onChange={(e) =>
                          handleStopChange(s.id, Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <span className="text-sm text-slate-400 mt-1">
                    • Dopłynięcie: {s.arrivalTime.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>

          <DrawerFooter className="mt-6">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full text-black">
                Zamknij
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>

      </Drawer>
      <BottomNavbar />
    </div>
  );
}
