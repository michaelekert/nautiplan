import { useEffect, useRef } from "react";
import { Map, MapStyle, config } from "@maptiler/sdk";
import { WindLayer } from "@maptiler/weather";

config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

export function useMapInstance() {
  const mapRef = useRef<Map | null>(null);
  const windLayerRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new Map({
      container: "map",
      style: MapStyle.BRIGHT,
      center: [18.6466, 54.352],
      zoom: 5,
      maxZoom: 10,
    });
    mapRef.current = map;

    const windLayer = new WindLayer({ opacity: 0.1 }) as any;
    windLayerRef.current = windLayer;

    map.on("load", () => {
      map.addLayer(windLayer);
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

  return { mapRef, windLayerRef };
}