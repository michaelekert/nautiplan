import { useState, useEffect, useCallback, useRef } from "react";
import { Map } from "@maptiler/sdk";

export function useWindPreviewMode(
  mapRef: React.RefObject<Map | null>,
  windLayerRef: React.RefObject<any>,
  getWindAt: (
    lon: number,
    lat: number,
    date: Date,
    options?: { signal?: AbortSignal }
  ) => Promise<{ speed: number; dir: number } | null>
) {
  const [isWindPreviewMode, setIsWindPreviewMode] = useState(true);
  const [previewTime, setPreviewTime] = useState<Date>(new Date());
  const [windData, setWindData] = useState<{ speed: number; dir: number } | null>(null);
  const [timeRange, setTimeRange] = useState<{ min: Date; max: Date }>({
    min: new Date(),
    max: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  });

  const updateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastUpdateRef = useRef(0);

  const updateWindData = useCallback(async () => {
    const now = Date.now();
    if (now - lastUpdateRef.current < 200) return;
    lastUpdateRef.current = now;

    const map = mapRef.current;
    if (!map || !isWindPreviewMode) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const center = map.getCenter();
    try {
      const wind = await getWindAt(center.lng, center.lat, previewTime, { signal: controller.signal });
      setWindData(wind);
    } catch (e) {
      if ((e as any).name === "AbortError") return;
    }
  }, [mapRef, isWindPreviewMode, previewTime, getWindAt]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isWindPreviewMode) return;

    const handleMove = () => {
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
  }, [mapRef, isWindPreviewMode, updateWindData]);

  useEffect(() => {
    if (isWindPreviewMode) updateWindData();
  }, [previewTime, updateWindData, isWindPreviewMode]);

  useEffect(() => {
    const windLayer = windLayerRef.current;
    if (!windLayer || !isWindPreviewMode) return;
    windLayer.setAnimationTime(Math.floor(previewTime.getTime() / 1000));
  }, [windLayerRef, previewTime, isWindPreviewMode]);

  useEffect(() => {
    const windLayer = windLayerRef.current;
    if (!windLayer) return;

    const handleSourceReady = () => {
      const startDate = windLayer.getAnimationStartDate();
      const endDate = windLayer.getAnimationEndDate();
      if (startDate && endDate) setTimeRange({ min: startDate, max: endDate });
    };

    windLayer.on("sourceReady", handleSourceReady);
    return () => windLayer.off("sourceReady", handleSourceReady);
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
