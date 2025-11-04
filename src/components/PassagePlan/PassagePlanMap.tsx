import "@maptiler/sdk/dist/maptiler-sdk.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import type { ReactNode } from "react";

interface PassagePlanMapProps {
  isDrawingMode: boolean;
  showCursorOnMobile: boolean;
  children?: ReactNode;
}

export function PassagePlanMap({ isDrawingMode, showCursorOnMobile, children }: PassagePlanMapProps) {
  return (
    <div
      id="map"
      className={`relative w-full max-w-6xl md:h-[60dvh] flex-grow overflow-hidden h-[calc(100dvh-10dvh)] ${
        isDrawingMode || showCursorOnMobile ? "cursor-crosshair" : ""
      }`}
    >
      {showCursorOnMobile && (
        <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
          <div className="relative w-8 h-8">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black -translate-y-1/2"></div>
            <div className="absolute top-0 left-1/2 w-[2px] h-full bg-black -translate-x-1/2"></div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
