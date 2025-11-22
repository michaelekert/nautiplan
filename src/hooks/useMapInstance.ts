import { useEffect, useRef } from "react";
import { Map, MapStyle, config } from "@maptiler/sdk";
import { WindLayer } from "@maptiler/weather";

config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

export function useMapInstance() {
  const mapRef = useRef<Map | null>(null);
  const windLayerRef = useRef<any>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new Map({
      container: "map",
      style: MapStyle.BRIGHT,
      center: [18.6466, 54.352],
      zoom: 5,
      maxZoom: 15,
      navigationControl: false,
      geolocateControl: false,
    });
    mapRef.current = map;

    const windLayer = new WindLayer({ opacity: 0.4 }) as any;
    windLayerRef.current = windLayer;

    map.on("load", () => {
      map.addLayer(windLayer);

      windLayer.on("sourceReady", () => {
        readyRef.current = true;
        console.log("✅ WindLayer source ready (dane pogodowe załadowane)");
        const now = new Date();
        const tsSec = Math.floor(now.getTime() / 1000);
        windLayer.setAnimationTime(tsSec);
      });

      windLayer.on("animationTimeSet", () => {
        console.log("⏱️ WindLayer animation time:", windLayer.getAnimationTimeDate());
      });

      map.addSource("seamark", {
        type: "raster",
        tiles: ["https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"],
        tileSize: 256,
      });

      map.addLayer({
        id: "seamark-layer",
        type: "raster",
        source: "seamark",
        paint: {
          "raster-opacity": 1,
        },
      });
    });
  }, []);

  const setTime = (date: Date) => {
    const windLayer = windLayerRef.current;
    if (!windLayer?.setAnimationTime || !readyRef.current) return;

    // DOKŁADNIE jak w przykładzie MapTiler - bez zaokrąglania!
    const tsSec = Math.floor(date.getTime() / 1000);
    windLayer.setAnimationTime(tsSec);
  };

  const getWindAt = async (
    lon: number,
    lat: number,
    date: Date
  ): Promise<{ speed: number; dir: number } | null> => {
    const windLayer = windLayerRef.current;

    if (!windLayer) return null;
    if (!readyRef.current) return null;

    try {
      // Po prostu odczytaj aktualne dane z warstwy - bez zmiany czasu!
      const windData = windLayer.pickAt(lon, lat);

      if (!windData || windData.speedMetersPerSecond === undefined) return null;

      return {
        speed: windData.speedMetersPerSecond,
        dir: windData.directionAngle ?? 0,
      };
    } catch (err) {
      console.error("❌ Błąd przy pobieraniu danych wiatru:", err);
      return null;
    }
  };

  return { mapRef, windLayerRef, setTime, getWindAt };
}