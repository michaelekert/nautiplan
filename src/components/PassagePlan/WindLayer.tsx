import { forwardRef, useImperativeHandle } from "react";
import { Map } from "@maptiler/sdk";

interface WindLayerProps {
  mapRef: React.MutableRefObject<Map | null>;
}

export const WindLayer = forwardRef(function WindLayer(
  { mapRef }: WindLayerProps,
  ref
) {
  useImperativeHandle(ref, () => ({
    setAnimationTime(date: Date) {
      console.log("🌬️ Sync wind animation time:", date.toISOString());
    },
    getWindAt(lon: number, lat: number, date: Date) {
      console.log("🌬️ getWindAt called - using WindLayer.pickAt() instead");
      return null;
    },
  }));

  return null;
});