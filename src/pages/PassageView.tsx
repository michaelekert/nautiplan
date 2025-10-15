import { useEffect, useState, useRef } from "react"
import { Map, MapStyle, config } from "@maptiler/sdk"
import '@maptiler/sdk/dist/maptiler-sdk.css'
import { WindLayer } from "@maptiler/weather"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BottomNavbar } from "@/components/BottomNavbar"

config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

type Point = [number, number];

type Segment = {
  from: number;
  to: number;
  distanceKm: number;
  distanceNm: number;
  course: number;
  departTime: Date;
  arriveTime: Date;
  departNext: Date;
};

export default function PassagePlan() {
  const mapRef = useRef<Map | null>(null);
  const windLayerRef = useRef<WindLayer | null>(null);
  const [currentTimeText, setCurrentTimeText] = useState("");
  const [points, setPoints] = useState<Point[]>([]);
  const [speeds, setSpeeds] = useState<number[]>([]);
  const [stopTimes, setStopTimes] = useState<Record<number, number>>({});
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [segments, setSegments] = useState<Segment[]>([]);

  const handleAddPoint = (lngLat: any) => {
    setPoints((prev) => {
      const newPoints = [...prev, [lngLat.lat, lngLat.lng]];
      if (newPoints.length > 1 && speeds.length < newPoints.length - 1) {
        setSpeeds((s) => [...s, 10]); 
      }
      return newPoints;
    });
  };

  const handleSpeedChange = (index: number, value: number) => {
    setSpeeds((prev) => {
      const newSpeeds = [...prev];
      newSpeeds[index] = value;
      return newSpeeds;
    });
  };

  const handleStopChange = (index: number, value: number) => {
    setStopTimes((prev) => ({ ...prev, [index]: value }));
  };

  const calculateDistanceKm = (p1: Point, p2: Point) => {
    const R = 6371;
    const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
    const dLon = ((p2[1] - p1[1]) * Math.PI) / 180;
    const lat1 = (p1[0] * Math.PI) / 180;
    const lat2 = (p2[0] * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const calculateCourse = (p1: Point, p2: Point) => {
    const y = Math.sin((p2[1] - p1[1]) * Math.PI / 180) * Math.cos(p2[0] * Math.PI / 180);
    const x =
      Math.cos(p1[0] * Math.PI / 180) * Math.sin(p2[0] * Math.PI / 180) -
      Math.sin(p1[0] * Math.PI / 180) * Math.cos(p2[0] * Math.PI / 180) *
      Math.cos((p2[1] - p1[1]) * Math.PI / 180);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  };

  const buildSegments = () => {
    const segs: Segment[] = [];
    let currentTime = new Date(startDate);

    for (let i = 0; i < points.length - 1; i++) {
      const distKm = calculateDistanceKm(points[i], points[i + 1]);
      const distNm = distKm / 1.852;
      const speedKnots = speeds[i] || 10;
      const travelHours = distNm / speedKnots;

      const departTime = new Date(currentTime);
      const arriveTime = new Date(currentTime);
      arriveTime.setHours(arriveTime.getHours() + travelHours);

      const stopTime = stopTimes[i] || 0;
      const departNext = new Date(arriveTime);
      departNext.setHours(departNext.getHours() + stopTime);

      segs.push({
        from: i + 1,
        to: i + 2,
        distanceKm: distKm,
        distanceNm: distNm,
        course: calculateCourse(points[i], points[i + 1]),
        departTime,
        arriveTime,
        departNext,
      });

      currentTime = new Date(departNext);
    }

    setSegments(segs);
  };

  useEffect(() => {
    buildSegments();
  }, [points, speeds, stopTimes, startDate]);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new Map({
      container: "map",
      style: MapStyle.BRIGHT,
      center: [20, 0],
      zoom: 3,
      maxZoom: 10,
    });

    mapRef.current = map;
    const windLayer = new WindLayer({ opacity: 0.4 });
    windLayerRef.current = windLayer;

    map.on("load", () => {
      map.addLayer(windLayer);

      map.addSource("route", {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "LineString", coordinates: [] } },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: { "line-color": "#4ade80", "line-width": 3 },
      });

      map.on("click", (e) => handleAddPoint(e.lngLat));
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const coords = points.map((p) => [p[1], p[0]]);
    map.getSource("route")?.setData({ type: "Feature", geometry: { type: "LineString", coordinates: coords } });

    if (map.getLayer("markers")) map.removeLayer("markers");
    if (map.getSource("markers")) map.removeSource("markers");

    if (points.length > 0) {
      map.addSource("markers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: points.map((p, idx) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [p[1], p[0]] },
            properties: { idx: idx + 1 },
          })),
        },
      });

      map.addLayer({
        id: "markers",
        type: "circle",
        source: "markers",
        paint: {
          "circle-radius": 6,
          "circle-color": "#ffffff",
        },
      });
    }

  
    if (map.getLayer("segment-labels")) map.removeLayer("segment-labels");
    if (map.getSource("segment-labels")) map.removeSource("segment-labels");

    if (segments.length > 0) {
      const features = segments.map((s, idx) => {
        const p1 = points[idx];
        const p2 = points[idx + 1];
        const midLat = (p1[0] + p2[0]) / 2;
        const midLng = (p1[1] + p2[1]) / 2;
        const travelHours = (s.arriveTime.getTime() - s.departTime.getTime()) / 3600000;
        const label = `${s.distanceNm.toFixed(0)} NM · ${travelHours.toFixed(1)}h`;

        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: [midLng, midLat] },
          properties: { label },
        };
      });

      map.addSource("segment-labels", {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      });

      map.addLayer({
        id: "segment-labels",
        type: "symbol",
        source: "segment-labels",
        layout: {
          "text-field": ["get", "label"],
          "text-size": 12,
          "text-offset": [0, 0.8],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 1.5,
        },
      });
    }
  }, [points, segments]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 text-white mb-20">
      <div id="map" className="w-full max-w-6xl h-[50vh] rounded-lg shadow-lg" />

      <div className="w-full max-w-6xl bg-slate-800 p-4 rounded-lg space-y-4">
        <div className="flex justify-between text-sm text-slate-300 border-b border-slate-700 pb-2">
          <span>🕓 Aktualna godzina danych:</span>
          <span>{currentTimeText}</span>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-slate-100">📍 Odcinki trasy</h3>
          {segments.length === 0 ? (
            <p className="text-slate-400 text-sm">Kliknij na mapę, aby dodać punkty trasy.</p>
          ) : (
            <ul className="space-y-4">
              {segments.map((s, i) => (
                <li key={i} className="p-4 bg-slate-700 rounded-md text-slate-100 space-y-2">
                  <div>Dystans: {s.distanceKm.toFixed(2)} km ({s.distanceNm.toFixed(2)} NM)</div>
                  <div>Wypłynięcie: {s.departTime.toLocaleString()}</div>
                  <div>Dopłynięcie: {s.arriveTime.toLocaleString()}</div>
                  <div>Wypłynięcie z portu: {s.departNext.toLocaleString()}</div>

                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 mt-2">
                    <div className="flex flex-col">
                      <Label htmlFor={`speed-${i}`}>Średnia prędkość (węzły)</Label>
                      <Input
                        id={`speed-${i}`}
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={speeds[i] || 10}
                        onChange={(e) => handleSpeedChange(i, Number(e.target.value))}
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label htmlFor={`stop-${i}`}>Czas postoju (h)</Label>
                      <Input
                        id={`stop-${i}`}
                        type="number"
                        min={0}
                        step={0.1}
                        value={stopTimes[i] || 0}
                        onChange={(e) => handleStopChange(i, Number(e.target.value))}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}
