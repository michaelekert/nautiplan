import { useState, useEffect, useCallback, useRef } from "react";
import { Map } from "@maptiler/sdk";

export function useWindPreviewMode(
  mapRef: React.RefObject<Map | null>,
  windLayerRef: React.RefObject<any>,
  getWindAt: (lon: number, lat: number, date: Date) => Promise<{ speed: number; dir: number } | null>
) {
  const [isWindPreviewMode, setIsWindPreviewMode] = useState(true);
  const [previewTime, setPreviewTime] = useState<Date>(new Date());
  const [windData, setWindData] = useState<{ speed: number; dir: number } | null>(null);
  const [timeRange, setTimeRange] = useState<{ min: Date; max: Date }>({
    min: new Date(),
    max: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // +4 dni
  });
  
  const crosshairSourceId = "wind-preview-crosshair";
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Aktualizacja danych wiatru dla centrum mapy
  const updateWindData = useCallback(async () => {
    const map = mapRef.current;
    if (!map || !isWindPreviewMode) return;

    const center = map.getCenter();
    const wind = await getWindAt(center.lng, center.lat, previewTime);
    setWindData(wind);
  }, [mapRef, isWindPreviewMode, previewTime, getWindAt]);

  // Dodanie czerwonej kropki na środku mapy
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isWindPreviewMode) return;

    const addCrosshair = () => {
      const center = map.getCenter();
      
      if (!map.getSource(crosshairSourceId)) {
        map.addSource(crosshairSourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [center.lng, center.lat]
            },
            properties: {}
          }
        });

        map.addLayer({
          id: crosshairSourceId,
          type: "circle",
          source: crosshairSourceId,
          paint: {
            "circle-radius": 8,
            "circle-color": "#ef4444",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
            "circle-opacity": 0.9
          }
        });
      }
    };

    if (map.loaded()) {
      addCrosshair();
    } else {
      map.once("load", addCrosshair);
    }

    return () => {
      if (map.getLayer(crosshairSourceId)) {
        map.removeLayer(crosshairSourceId);
      }
      if (map.getSource(crosshairSourceId)) {
        map.removeSource(crosshairSourceId);
      }
    };
  }, [mapRef, isWindPreviewMode]);

  // Aktualizacja pozycji kropki przy ruchu mapy
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isWindPreviewMode) return;

    const handleMove = () => {
      const center = map.getCenter();
      const source = map.getSource(crosshairSourceId) as any;
      
      if (source) {
        source.setData({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [center.lng, center.lat]
          },
          properties: {}
        });
      }

      // Debounce wind data updates
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      updateTimerRef.current = setTimeout(() => {
        updateWindData();
      }, 200);
    };

    map.on("move", handleMove);
    return () => {
      map.off("move", handleMove);
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, [mapRef, isWindPreviewMode, updateWindData]);

  // Inicjalna aktualizacja danych wiatru
  useEffect(() => {
    if (isWindPreviewMode) {
      updateWindData();
    }
  }, [isWindPreviewMode, previewTime, updateWindData]);

  // Aktualizacja czasu w WindLayer gdy zmienia się previewTime
  useEffect(() => {
    const windLayer = windLayerRef.current;
    if (!windLayer || !isWindPreviewMode) return;

    const tsSec = Math.floor(previewTime.getTime() / 1000);
    windLayer.setAnimationTime(tsSec);
  }, [windLayerRef, previewTime, isWindPreviewMode]);

  // Synchronizacja zakresu czasowego z WindLayer
  useEffect(() => {
    const windLayer = windLayerRef.current;
    if (!windLayer) return;

    const handleSourceReady = () => {
      const startDate = windLayer.getAnimationStartDate();
      const endDate = windLayer.getAnimationEndDate();
      
      if (startDate && endDate) {
        setTimeRange({ min: startDate, max: endDate });
      }
    };

    windLayer.on("sourceReady", handleSourceReady);
    
    return () => {
      windLayer.off("sourceReady", handleSourceReady);
    };
  }, [windLayerRef]);

  const enableWindPreviewMode = useCallback(() => {
    setIsWindPreviewMode(true);
    setPreviewTime(new Date());
  }, []);

  const disableWindPreviewMode = useCallback(() => {
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