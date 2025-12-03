import { useEffect, useRef, useState } from "react";
import { Map, MapStyle, MaptilerNavigationControl, config } from "@maptiler/sdk";
import { WindLayer } from "@maptiler/weather";

config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

export function useMapInstance() {
  const mapRef = useRef<Map | null>(null);
  const windLayerRef = useRef<any>(null);
  const readyRef = useRef(false);
  const [isWindLayerReady, setIsWindLayerReady] = useState(false);

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

    const compassControl = new MaptilerNavigationControl({ showZoom: false, showCompass: true });
    map.addControl(compassControl);

    map.on("load", () => {
      map.addSource("seamark", {
        type: "raster",
        tiles: ["https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"],
        tileSize: 256,
      });

      map.addLayer({
        id: "seamark-layer",
        type: "raster",
        source: "seamark",
        paint: { "raster-opacity": 1 },
      });

      const windLayer = new WindLayer({ opacity: 0.4 }) as any;
      windLayerRef.current = windLayer;

      map.addLayer(windLayer);

      windLayer.on("sourceReady", () => {
        readyRef.current = true;
        setIsWindLayerReady(true);
        const now = new Date();
        windLayer.setAnimationTime(Math.floor(now.getTime() / 1000));
      });
    });
  }, []);

  const setTime = (date: Date) => {
    const windLayer = windLayerRef.current;
    if (!windLayer?.setAnimationTime || !readyRef.current) return;

    const tsSec = Math.floor(date.getTime() / 1000);
    windLayer.setAnimationTime(tsSec);
  };

  const getWindAt = async (lon: number, lat: number): Promise<{ speed: number; dir: number } | null> => {
    const windLayer = windLayerRef.current;
    if (!windLayer || !readyRef.current) return null;

    try {
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

  return { mapRef, windLayerRef, setTime, getWindAt, isWindLayerReady };
}
