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
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

interface Segment {
  id: string;
  startName: string;
  endName: string;
  autoStartName: string;
  autoEndName: string;
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
  const lastCoordRef = useRef<[number, number] | null>(null);

  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [segments, setSegments] = useState<Segment[]>([]);
  const [defaultSpeed, setDefaultSpeed] = useState<number>(5);
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [tempRoutePoints, setTempRoutePoints] = useState<[number, number][]>(
    []
  );
  const [showRouteActions, setShowRouteActions] = useState<boolean>(false);

  const defaultSpeedRef = useRef<number>(defaultSpeed);
  const segmentsRef = useRef<Segment[]>([]);

  useEffect(() => {
    defaultSpeedRef.current = defaultSpeed;
  }, [defaultSpeed]);

  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

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
            filter: [
              "all",
              ["==", "meta", "vertex"],
              ["==", "$type", "Point"],
            ],
            paint: { "circle-radius": 7, "circle-color": "#fff" },
          },
          {
            id: "gl-draw-vertex-active",
            type: "circle",
            filter: [
              "all",
              ["==", "meta", "vertex"],
              ["==", "$type", "Point"],
            ],
            paint: { "circle-radius": 4, "circle-color": "#22c55e" },
          },
        ],
      });

      drawRef.current = draw;
      map.addControl(draw);

      setTimeout(() => {
        const drawControls = document.querySelectorAll(
          ".mapboxgl-ctrl-group.mapboxgl-ctrl"
        );
        drawControls.forEach((elem) =>
          elem.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group")
        );
      }, 100);

      map.on("draw.create", enforceSingleLine);
      map.on("draw.delete", updateSegments);
      map.on("draw.update", updateSegments);
    });

    windLayer.on("sourceReady", () => {
      const updateTime = () => {
        const date = windLayer.getAnimationTimeDate();
        console.log("Wind animation time:", date.toLocaleString());
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
        data.features.find((f: any) => f.place_type?.includes("region")) ||
        data.features[3];

      return place?.text || place?.place_name || "Nieznane miejsce";
    } catch (e) {
      console.error("Błąd reverse geocodingu:", e);
      return "Nieznane miejsce";
    }
  }

  const addPointAtCenter = () => {
    const map = mapRef.current;
    if (!map || !isDrawingMode) return;

    const center = map.getCenter();
    const newPoint: [number, number] = [center.lng, center.lat];

    setTempRoutePoints((prev) => {
      if (prev.length === 0 && lastCoordRef.current) prev = [lastCoordRef.current];
      const updated = [...prev, newPoint];
      const draw = drawRef.current;
      if (draw && updated.length >= 2) {
        const tempFeature = draw.getAll().features.find(f => f.properties?.temp);
        if (tempFeature) draw.delete(tempFeature.id);
        draw.add({
          type: "Feature",
          properties: { temp: true },
          geometry: { type: "LineString", coordinates: updated },
        });
      }
      return updated;
    });
  };

  const finishDrawing = () => {
    const draw = drawRef.current;
    if (!draw || tempRoutePoints.length < 2) return;

    const tempFeature = draw.getAll().features.find(f => f.properties?.temp);
    if (tempFeature) draw.delete(tempFeature.id);

    draw.add({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: tempRoutePoints },
    });

    setIsDrawingMode(false);
    setTempRoutePoints([]);
    setShowRouteActions(false);

    updateSegments();
  };

  const cancelDrawing = () => {
    const draw = drawRef.current;
    if (draw) {
      const tempFeature = draw.getAll().features.find(f => f.properties?.temp);
      if (tempFeature) draw.delete(tempFeature.id);
    }
    setIsDrawingMode(false);
    setTempRoutePoints([]);
    setShowRouteActions(false);
  };

  const startRouteDrawing = () => setShowRouteActions(true);
  const startDrawing = () => {
    setIsDrawingMode(true);
    setTempRoutePoints([]);
    if (segments.length > 0 && lastCoordRef.current) {
      setTempRoutePoints([lastCoordRef.current]);
    }
  };

  const enforceSingleLine = (e: any) => {
    const draw = drawRef.current;
    if (!draw) return;

    const lines = draw.getAll().features.filter(f => f.geometry.type === "LineString");
    if (lines.length > 1) {
      const lastLine = lines[lines.length - 2] as any;
      const newLine = e.features[0];
      const lastEnd = lastLine.geometry.coordinates.at(-1);
      const newStart = newLine.geometry.coordinates[0];
      const distance = turf.distance(turf.point(lastEnd), turf.point(newStart));
      if (distance > 0.001) {
        draw.delete(newLine.id);
        console.warn("Musisz kontynuować trasę od końca poprzedniego segmentu");
        return;
      }
    }

    updateSegments();
  };

  const updateSegments = async () => {
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
      const existingSegment = prevSegments.find(s => s.id === String(f.id));

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

      const startName = existingSegment?.startName ?? autoStartName ?? "Nieznane miejsce";
      const endName = existingSegment?.endName ?? autoEndName ?? "Nieznane miejsce";
      const distanceKm = turf.length(f, { units: "kilometers" });
      const distanceNm = distanceKm / 1.852;
      const speed = existingSegment?.speed ?? defaultSpeedRef.current;
      const stopHours = existingSegment?.stopHours ?? 0;
      const timeHours = distanceNm / speed;
      const arrivalTime = new Date(currentTime);
      arrivalTime.setHours(arrivalTime.getHours() + timeHours);

      newSegments.push({ id: String(f.id), startName, endName, autoStartName: autoStartName ?? "Nieznane miejsce", autoEndName: autoEndName ?? "Nieznane miejsce", distanceNm, speed, stopHours, timeHours, arrivalTime });

      currentTime = new Date(arrivalTime);
      currentTime.setHours(currentTime.getHours() + stopHours);
    }

    setSegments(newSegments);

    const allFeatures = draw.getAll().features;
    const lastLine = allFeatures
      .filter(f => f.geometry.type === "LineString")
      .at(-1) as { geometry: { type: "LineString"; coordinates: [number, number][] } } | undefined;

    lastCoordRef.current = lastLine?.geometry.coordinates.at(-1) ?? null;

    updateLabelsOnMap(newSegments, data.features, map);
  };

  const updateLabelsOnMap = (segments: Segment[], features: any[], map: Map) => {
    if (map.getLayer("segment-labels")) map.removeLayer("segment-labels");
    if (map.getSource("segment-labels")) map.removeSource("segment-labels");

    const labelFeatures = features
      .filter(f => f.geometry.type === "LineString" && !f.properties?.temp)
      .map(f => {
        const coords = f.geometry.coordinates as [number, number][];
        const midpoint = turf.along(turf.lineString(coords), turf.length(f) / 2);
        const seg = segments.find(s => s.id === f.id);
        const label = `${seg?.distanceNm.toFixed(1)} NM · ${seg?.timeHours.toFixed(1)} h`;
        return { type: "Feature" as const, geometry: midpoint.geometry, properties: { label } };
      });

    map.addSource("segment-labels", { type: "geojson", data: { type: "FeatureCollection", features: labelFeatures } });
    map.addLayer({ id: "segment-labels", type: "symbol", source: "segment-labels", layout: { "text-field": ["get", "label"], "text-size": 12, "text-offset": [0, 1], "text-anchor": "top" }, paint: { "text-color": "#fff", "text-halo-color": "#000", "text-halo-width": 1.5 } });
  };

  const handleSpeedChange = (id: string, newSpeed: number) => {
    setSegments(prev => recalcSegments(prev.map(s => s.id === id ? { ...s, speed: newSpeed } : s)));
  };

  const handleStopChange = (id: string, newStop: number) => {
    setSegments(prev => recalcSegments(prev.map(s => s.id === id ? { ...s, stopHours: newStop } : s)));
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

  const undoLastSegment = () => {
    const draw = drawRef.current;
    if (!draw) return;
    const lines = draw.getAll().features.filter(f => f.geometry.type === "LineString");
    if (lines.length === 0) return;
    draw.delete(lines[lines.length - 1].id);
    updateSegments();
  };

  const clearAllSegments = () => {
    const draw = drawRef.current;
    if (!draw) return;
    draw.deleteAll();
    updateSegments();
  };

  useEffect(() => {
    if (segments.length > 0) setSegments(recalcSegments(segments));
  }, [startDate]);

  
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: any) => {
      if (!isDrawingMode) return;
      const { lng, lat } = e.lngLat;
      setTempRoutePoints((prev) => {
        let updated: [number, number][] = prev;
        if (prev.length === 0 && lastCoordRef.current) updated = [lastCoordRef.current];
        const newPoint: [number, number] = [lng, lat];
        const newPoints = [...updated, newPoint];

        const draw = drawRef.current;
        if (draw && newPoints.length >= 2) {
          draw.getAll().features
            .filter(f => f.properties?.temp)
            .forEach(f => draw.delete(f.id));
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
  }, [isDrawingMode]);



  return (
    <div className="flex flex-col items-center gap-6 p-0 md:p-6 text-white relative">
      <div
        id="map"
        className={`relative w-full max-w-6xl md:h-[60dvh] flex-grow overflow-hidden h-[calc(100dvh-10dvh)] ${
          isDrawingMode ? "cursor-crosshair" : ""
        }`}
      >
        {isDrawingMode && (
          <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
            <div className="relative w-8 h-8">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black -translate-y-1/2"></div>
              <div className="absolute top-0 left-1/2 w-[2px] h-full bg-black -translate-x-1/2"></div>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden fixed left-1/2 bottom-1/4 -translate-x-1/2 z-50">
        {!showRouteActions ? (
          <Button onClick={startRouteDrawing} className="bg-slate-900 hover:bg-blue-700">
            Rysuj trasę
          </Button>
        ) : !isDrawingMode ? (
          <div className="flex flex-col items-center gap-2">
            <Button onClick={startDrawing}>
              {segments.length === 0 ? "Zacznij trasę" : "Kontynuuj trasę"}
            </Button>
            <Button onClick={undoLastSegment}>Cofnij</Button>
            <Button onClick={clearAllSegments}>Usuń wszystko</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <Button onClick={addPointAtCenter} className="bg-blue-600 hover:bg-blue-700">
              Dodaj punkt
            </Button>
            <Button onClick={cancelDrawing} className="bg-red-600 hover:bg-red-700">
              Anuluj
            </Button>
            {tempRoutePoints.length >= 2 && (
              <Button onClick={finishDrawing} className="bg-green-600 hover:bg-green-700 w-full">
                Dodaj postój
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="hidden md:block w-full max-w-6xl bg-slate-800 p-6 rounded-lg space-y-6 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
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
              className="rounded-lg border border-slate-600 bg-slate-900 text-white w-1/2"
            />
          </div>

          <div className="flex gap-2 justify-end">
            {!showRouteActions ? (
              <Button
                onClick={startRouteDrawing}
                className="bg-slate-900 hover:bg-blue-700"
              >
                Rysuj trasę
              </Button>
            ) : !isDrawingMode ? (
              <>
                <Button onClick={startDrawing} className="bg-blue-600 hover:bg-blue-700">
                  {segments.length === 0 ? "Zacznij trasę" : "Kontynuuj trasę"}
                </Button>
                <Button onClick={undoLastSegment} className="text-white border-slate-500">
                  Cofnij
                </Button>
                <Button onClick={clearAllSegments} className="text-white border-slate-500">
                  Usuń wszystko
                </Button>
              </>
            ) : (
              <>
                <Button onClick={finishDrawing} className="bg-green-600 hover:bg-green-700">
                  Dodaj postój
                </Button>
                <Button onClick={cancelDrawing} className="bg-red-600 hover:bg-red-700">
                  Anuluj
                </Button>
              </>
            )}
          </div>
        </div>

        {segments.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">
            ✏️ Kliknij „Rysuj trasę”, aby rozpocząć planowanie trasy.
          </p>
        ) : (
          <ul className="space-y-4">
            {segments.map((s) => (
              <li
                key={s.id}
                className="p-4 bg-slate-700 rounded-lg flex flex-col gap-3 shadow-md"
              >
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    value={s.startName}
                    onChange={(e) =>
                      setSegments((prev) =>
                        prev.map((seg) =>
                          seg.id === s.id
                            ? { ...seg, startName: e.target.value }
                            : seg
                        )
                      )
                    }
                    className="rounded-lg border border-slate-600 bg-slate-900 text-white w-full"
                  />
                  <span>→</span>
                  <Input
                    type="text"
                    value={s.endName}
                    onChange={(e) =>
                      setSegments((prev) =>
                        prev.map((seg) =>
                          seg.id === s.id
                            ? { ...seg, endName: e.target.value }
                            : seg
                        )
                      )
                    }
                    className="rounded-lg border border-slate-600 bg-slate-900 text-white w-full"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <div className="flex flex-col">
                    <Label className="text-slate-200 text-sm">Prędkość (węzły)</Label>
                    <Input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={s.speed}
                      onChange={(e) =>
                        handleSpeedChange(s.id, Number(e.target.value))
                      }
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
                      onChange={(e) =>
                        handleStopChange(s.id, Number(e.target.value))
                      }
                      className="rounded-lg border border-slate-600 bg-slate-900 text-white"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col justify-end">
                    <Label className="text-slate-200 text-sm mb-1">
                      Przewidywany czas dopłynięcia
                    </Label>
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
        <DrawerTrigger
          className="md:hidden fixed left-1/2 bottom-1/6 -translate-x-1/2 z-50"
          asChild
        >
          <Button className="w-1/2">Otwórz Panel Planowania</Button>
        </DrawerTrigger>

        <DrawerContent className="md:hidden w-full h-[80dvh] max-w-full bg-slate-800 text-white p-0 flex flex-col">
          <DrawerHeader className="p-6">
            <DrawerTitle className="text-white">⚓ Ustawienia trasy</DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <Label htmlFor="startDate" className="mb-2">
                  📅 Data i godzina wypłynięcia
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 px-2 rounded-lg border border-slate-600 bg-slate-900 text-white appearance-none"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="defaultSpeed" className="mb-2">
                  ⚓ Domyślna prędkość (KN)
                </Label>
                <Input
                  id="defaultSpeed"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={defaultSpeed}
                  onChange={(e) => setDefaultSpeed(Number(e.target.value))}
                  className="w-full h-10 px-2 rounded-lg border border-slate-600 bg-slate-900 text-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {segments.map((s) => (
                <div key={s.id} className="p-3 bg-slate-700 rounded-lg flex flex-col gap-3">
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      value={s.startName}
                      onChange={(e) =>
                        setSegments((prev) =>
                          prev.map((seg) =>
                            seg.id === s.id
                              ? { ...seg, startName: e.target.value }
                              : seg
                          )
                        )
                      }
                      className="flex-1 rounded-lg border border-slate-600 bg-slate-900 text-white"
                    />
                    <span>→</span>
                    <Input
                      type="text"
                      value={s.endName}
                      onChange={(e) =>
                        setSegments((prev) =>
                          prev.map((seg) =>
                            seg.id === s.id
                              ? { ...seg, endName: e.target.value }
                              : seg
                          )
                        )
                      }
                      className="flex-1 rounded-lg border border-slate-600 bg-slate-900 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div className="flex flex-col">
                      <Label className="text-slate-200 text-sm">Prędkość (węzły)</Label>
                      <Input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={s.speed}
                        onChange={(e) =>
                          handleSpeedChange(s.id, Number(e.target.value))
                        }
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
                        onChange={(e) =>
                          handleStopChange(s.id, Number(e.target.value))
                        }
                        className="rounded-lg border border-slate-600 bg-slate-900 text-white"
                      />
                    </div>
                  </div>

                  <div className="text-sm text-slate-300">
                    Przewidywany czas dopłynięcia: {s.arrivalTime.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <BottomNavbar />
    </div>
  );
}
