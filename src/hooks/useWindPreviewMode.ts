import { useState, useEffect, useCallback, useRef } from "react";
import { Map } from "@maptiler/sdk";

export function useWindPreviewMode(
  mapRef: React.RefObject<Map | null>,
  windLayerRef: React.RefObject<any>,
  getWindAt: (lon: number, lat: number) => Promise<{ speed: number; dir: number } | null>,
  isWindLayerReady: boolean
) {
  const [isWindPreviewMode, setIsWindPreviewMode] = useState(true);
  const [previewTime, setPreviewTime] = useState<Date>(new Date());
  const [windData, setWindData] = useState<{ speed: number; dir: number } | null>(null);
  const [timeRange, setTimeRange] = useState<{ min: Date; max: Date }>({
    min: new Date(),
    max: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  });

  const updateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUpdateRef = useRef(0);

  const updateWindData = useCallback(async (force = false) => {
    console.log("🔄 updateWindData wywołane", { force });
    
    const now = Date.now();
    if (!force && now - lastUpdateRef.current < 200) {
      console.log("⏭️ Pominięto - za szybko od ostatniego update");
      return;
    }
    lastUpdateRef.current = now;

    const map = mapRef.current;
    const windLayer = windLayerRef.current;
    
    console.log("📊 Stan:", {
      map: !!map,
      windLayer: !!windLayer,
      isWindPreviewMode,
      isWindLayerReady
    });
    
    if (!map || !windLayer || !isWindPreviewMode || !isWindLayerReady) {
      console.log("❌ Brak wymaganych warunków");
      return;
    }

    const center = map.getCenter();
    console.log("📍 Centrum mapy:", center.lng, center.lat);
    
    try {
      const timeSec = Math.floor(previewTime.getTime() / 1000);
      console.log("⏰ Ustawiam czas animacji:", previewTime, "->", timeSec);
      windLayer.setAnimationTime(timeSec);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("🌬️ Pobieram dane wiatru...");
      let wind = await getWindAt(center.lng, center.lat);
      
      if (!wind) {
        console.log("⚠️ Brak danych, próbuję ponownie...");
        await new Promise(resolve => setTimeout(resolve, 150));
        wind = await getWindAt(center.lng, center.lat);
      }
      
      console.log("✅ Dane wiatru pobrane:", wind);
      setWindData(wind);
    } catch (e) {
      console.error("❌ Błąd przy pobieraniu danych wiatru:", e);
    }
  }, [mapRef, windLayerRef, isWindPreviewMode, isWindLayerReady, previewTime, getWindAt]);

  useEffect(() => {
    const windLayer = windLayerRef.current;
    if (!windLayer || !isWindLayerReady) return;

    const startDate = windLayer.getAnimationStartDate();
    const endDate = windLayer.getAnimationEndDate();
    console.log("📅 Zakres dat:", startDate, "->", endDate);
    
    if (startDate && endDate) {
      setTimeRange({ min: startDate, max: endDate });
    }
  }, [windLayerRef, isWindLayerReady]);

  useEffect(() => {
    console.log("🎯 useEffect [isWindPreviewMode, isWindLayerReady]:", { isWindPreviewMode, isWindLayerReady });
    
    if (isWindPreviewMode && isWindLayerReady) {
      console.log("⏱️ Planuje updateWindData za 150ms");
      const timer = setTimeout(() => {
        console.log("🚀 Wywołuję updateWindData");
        updateWindData();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isWindPreviewMode, isWindLayerReady, updateWindData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isWindPreviewMode || !isWindLayerReady) return;

    const handleMove = () => {
      console.log("🗺️ Mapa się poruszyła");
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
      updateTimerRef.current = setTimeout(() => {
        updateWindData();
      }, 200);
    };

    map.on("move", handleMove);
    return () => {
      map.off("move", handleMove);
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    };
  }, [mapRef, isWindPreviewMode, isWindLayerReady, updateWindData]);

  useEffect(() => {
    if (isWindPreviewMode && isWindLayerReady) {
      console.log("⏰ Zmiana czasu - updateWindData z opóźnieniem");
      const timer = setTimeout(() => {
        updateWindData(true);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [previewTime, isWindPreviewMode, isWindLayerReady, updateWindData]);

  const enableWindPreviewMode = useCallback(() => {
    console.log("✨ Włączam Wind Preview Mode");
    setIsWindPreviewMode(true);
    setPreviewTime(new Date());
  }, []);

  const disableWindPreviewMode = useCallback(() => {
    console.log("🚫 Wyłączam Wind Preview Mode");
    setIsWindPreviewMode(false);
    setWindData(null);
  }, []);

  return {
    isWindPreviewMode,
    windData,
    previewTime,
    timeRange,
    setPreviewTime,
    enableWindPreviewMode,
    disableWindPreviewMode,
  };
}
