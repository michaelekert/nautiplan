import { useCallback } from "react";
import { Map } from "@maptiler/sdk";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { Segment } from "../types/passagePlan";

export interface SavedRoute {
  id: string;
  name: string;
  savedAt: string;
  startDate: string;
  defaultSpeed: number;
  segments: Segment[];
  drawFeatures: any;
  mapCenter: [number, number];
  mapZoom: number;
}

export function useRouteSave(
  mapRef: React.RefObject<Map | null>,
  drawRef: React.RefObject<MapboxDraw | null>,
  segments: Segment[],
  startDate: string,
  defaultSpeed: number
) {

  const saveRoute = useCallback(
    (routeName: string): SavedRoute | null => {
      const map = mapRef.current;
      const draw = drawRef.current;

      if (!map || !draw) {
        console.error("Mapa lub draw nie są zainicjalizowane");
        return null;
      }

      const drawData = draw.getAll();
      
      if (drawData.features.length === 0) {
        console.error("Brak narysowanej trasy do zapisania");
        return null;
      }

      const route: SavedRoute = {
        id: `route_${Date.now()}`,
        name: routeName,
        savedAt: new Date().toISOString(),
        startDate,
        defaultSpeed,
        segments: segments.map(seg => ({
          ...seg,
          arrivalTime: seg.arrivalTime,
        })),
        drawFeatures: drawData,
        mapCenter: [map.getCenter().lng, map.getCenter().lat],
        mapZoom: map.getZoom(),
      };

      try {
        const existingRoutes = getAllSavedRoutes();
        
        existingRoutes.push(route);
        
        localStorage.setItem("savedRoutes", JSON.stringify(existingRoutes));
        
        console.log("✅ Trasa zapisana:", routeName);
        return route;
      } catch (error) {
        console.error("❌ Błąd przy zapisywaniu trasy:", error);
        return null;
      }
    },
    [mapRef, drawRef, segments, startDate, defaultSpeed]
  );

  const loadRoute = useCallback(
    (routeId: string, onSegmentsUpdate: () => Promise<void>): boolean => {
      const map = mapRef.current;
      const draw = drawRef.current;

      if (!map || !draw) {
        console.error("Mapa lub draw nie są zainicjalizowane");
        return false;
      }

      try {
        const routes = getAllSavedRoutes();
        const route = routes.find((r) => r.id === routeId);

        if (!route) {
          console.error("Nie znaleziono trasy o ID:", routeId);
          return false;
        }

        draw.deleteAll();

        const layers = map.getStyle().layers || [];
        layers.forEach((layer) => {
          if (
            layer.id.startsWith("segment-endpoints") ||
            layer.id.startsWith("click-point-") ||
            layer.id.startsWith("segment-labels") ||
            layer.id.startsWith("segment-endpoint-labels")
          ) {
            if (map.getLayer(layer.id)) map.removeLayer(layer.id);
            if (map.getSource(layer.id)) map.removeSource(layer.id);
          }
        });

        if (route.drawFeatures && route.drawFeatures.features) {
          route.drawFeatures.features.forEach((feature: any) => {
            if (!feature.properties?.temp) {
              draw.add(feature);
            }
          });
        }

        if (route.mapCenter && route.mapZoom) {
          map.setCenter(route.mapCenter);
          map.setZoom(route.mapZoom);
        }

        setTimeout(() => {
          onSegmentsUpdate();
        }, 100);

        console.log("✅ Trasa wczytana:", route.name);
        return true;
      } catch (error) {
        console.error("❌ Błąd przy wczytywaniu trasy:", error);
        return false;
      }
    },
    [mapRef, drawRef]
  );

  const deleteRoute = useCallback((routeId: string): boolean => {
    try {
      const routes = getAllSavedRoutes();
      const filtered = routes.filter((r) => r.id !== routeId);
      
      localStorage.setItem("savedRoutes", JSON.stringify(filtered));
      
      console.log("✅ Trasa usunięta:", routeId);
      return true;
    } catch (error) {
      console.error("❌ Błąd przy usuwaniu trasy:", error);
      return false;
    }
  }, []);

  const getSavedRoutes = useCallback((): SavedRoute[] => {
    return getAllSavedRoutes();
  }, []);

  return {
    saveRoute,
    loadRoute,
    deleteRoute,
    getSavedRoutes,
  };
}

function getAllSavedRoutes(): SavedRoute[] {
  try {
    const stored = localStorage.getItem("savedRoutes");
    if (!stored) return [];
    
    const routes = JSON.parse(stored);
    
    return routes.map((route: SavedRoute) => ({
      ...route,
      segments: route.segments.map((seg: Segment) => ({
        ...seg,
        arrivalTime: new Date(seg.arrivalTime),
      })),
    }));
  } catch (error) {
    console.error("❌ Błąd przy odczytywaniu tras z localStorage:", error);
    return [];
  }
}