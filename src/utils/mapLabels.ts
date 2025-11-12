import { Map } from "@maptiler/sdk";
import * as turf from "@turf/turf";
import type { Segment } from "../types/passagePlan";

export function updateLabelsOnMap(
  segments: Segment[],
  features: any[],
  map: Map
) {
  const updateSourceData = (sourceId: string, features: any[]) => {
    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as any).setData({
        type: "FeatureCollection",
        features,
      });
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      });
    }
  };

  const labelFeatures = features
    .filter((f) => f.geometry.type === "LineString" && !f.properties?.temp)
    .map((f) => {
      const coords = f.geometry.coordinates as [number, number][];
      const midpoint = turf.along(turf.lineString(coords), turf.length(f) / 2);
      const seg = segments.find((s) => s.id === String(f.id));
      const label = `${seg?.distanceNm.toFixed(1)} NM · ${seg?.timeHours.toFixed(1)} h`;
      return {
        type: "Feature" as const,
        geometry: midpoint.geometry,
        properties: { label },
      };
    });

  updateSourceData("segment-labels", labelFeatures);

  if (!map.getLayer("segment-labels")) {
    map.addLayer({
      id: "segment-labels",
      type: "symbol",
      source: "segment-labels",
      layout: {
        "text-field": ["get", "label"],
        "text-size": 12,
        "text-offset": [0, 1],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#fff",
        "text-halo-color": "#000",
        "text-halo-width": 1.5,
      },
    });
  }

  const endpointFeatures: any[] = [];
  if (segments.length > 0 && features.length > 0) {
    const firstSeg = segments[0];
    const firstCoord = (features[0].geometry.coordinates as [number, number][])[0];
    endpointFeatures.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: firstCoord },
      properties: {
        label: `${firstSeg.startName} · ${firstSeg.arrivalTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      },
    });
  }

  for (const f of features) {
    if (f.geometry.type !== "LineString") continue;

    const seg = segments.find((s) => s.id === String(f.id));
    if (!seg) continue;

    const coords = f.geometry.coordinates as [number, number][];
    const end = coords[coords.length - 1];
    const arrivalTime = seg.arrivalTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    endpointFeatures.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: end },
      properties: { label: `${seg.endName} · ${arrivalTime}` },
    });
  }

  updateSourceData("segment-endpoints", endpointFeatures);

  if (!map.getLayer("segment-endpoints")) {
    map.addLayer({
      id: "segment-endpoints",
      type: "circle",
      source: "segment-endpoints",
      paint: {
        "circle-radius": 6,
        "circle-color": "#22c55e",
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });
  }

  if (!map.getLayer("segment-endpoint-labels")) {
    map.addLayer({
      id: "segment-endpoint-labels",
      type: "symbol",
      source: "segment-endpoints",
      layout: {
        "text-field": ["get", "label"],
        "text-size": 12,
        "text-offset": [0, 1.2],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#fff",
        "text-halo-color": "#000",
        "text-halo-width": 1.5,
      },
    });
  }
}
