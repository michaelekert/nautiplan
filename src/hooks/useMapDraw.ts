import { useEffect, useRef } from "react";
import { Map } from "@maptiler/sdk";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { MapDrawHandlers } from "../types/passagePlan";

export function useMapDraw(
  mapRef: React.RefObject<Map | null>,
  handlers: MapDrawHandlers
) {
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || drawRef.current) return;

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

    map.once("load", () => {
      map.addControl(draw);

      setTimeout(() => {
        const drawControls = document.querySelectorAll(
          ".mapboxgl-ctrl-group.mapboxgl-ctrl"
        );
        drawControls.forEach((elem) =>
          elem.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group")
        );
      }, 100);

      map.on("draw.create", handlers.enforceSingleLine);
      map.on("draw.delete", handlers.updateSegments);
      map.on("draw.update", handlers.updateSegments);
    });
  }, [mapRef, handlers]);

  return drawRef;
}