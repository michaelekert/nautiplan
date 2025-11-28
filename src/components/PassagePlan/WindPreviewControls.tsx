import { useState } from "react";

interface WindPreviewControlsProps {
  windData: { speed: number; dir: number } | null;
  previewTime: Date;
  timeRange: { min: Date; max: Date };
  onTimeChange: (date: Date) => void;
}

export function WindPreviewControls({
  windData,
  previewTime,
  timeRange,
  onTimeChange,
}: WindPreviewControlsProps) {
  const [unit, setUnit] = useState<"ms" | "kmh" | "kt" | "bft">("kmh");

  const toggleUnit = () => {
    setUnit((prev) => {
      if (prev === "ms") return "kmh";
      if (prev === "kmh") return "kt";
      if (prev === "kt") return "bft";
      return "ms";
    });
  };

  const formatDate = (date: Date) =>
    date.toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getCompassDirection = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const normalized = ((degrees % 360) + 360) % 360;
    const index = Math.floor((normalized + 22.5) / 45) % 8;
    return directions[index];
  };

  // Speed conversions — windData.speed is in m/s
  const ms = windData ? windData.speed : null;
  const speedMs = ms?.toFixed(1) ?? "—";
  const speedKmh = ms ? (ms * 3.6).toFixed(1) : "—";
  const speedKt = ms ? (ms * 1.944).toFixed(1) : "—";

  // Beaufort scale
  const msToBeaufort = (speed: number) => {
    if (speed < 0.5) return 0;
    if (speed < 1.6) return 1;
    if (speed < 3.4) return 2;
    if (speed < 5.5) return 3;
    if (speed < 8) return 4;
    if (speed < 10.8) return 5;
    if (speed < 13.9) return 6;
    if (speed < 17.2) return 7;
    if (speed < 20.8) return 8;
    if (speed < 24.5) return 9;
    if (speed < 28.5) return 10;
    if (speed < 32.7) return 11;
    return 12;
  };

  const speedBft = ms !== null ? msToBeaufort(ms) : "—";

  const getUnitValue = () => {
    switch (unit) {
      case "ms":
        return `${speedMs} m/s`;
      case "kmh":
        return `${speedKmh} km/h`;
      case "kt":
        return `${speedKt} kt`;
      case "bft":
        return `${speedBft} Bft`;
    }
  };

  const direction = windData ? getCompassDirection(windData.dir) : "—";

  const progress =
    ((previewTime.getTime() - timeRange.min.getTime()) /
      (timeRange.max.getTime() - timeRange.min.getTime())) *
    100;

  return (
    <>
      {/* TOP FLOATING PANEL */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 w-[50%] max-w-xs">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-slate-700">
          <div className="flex items-center gap-1 mb-1">
            <div
              className="w-10 h-10 flex items-center justify-center bg-white-500 rounded-full transition-transform duration-500"
              style={windData ? { transform: `rotate(${windData.dir}deg)` } : {}}
            >
              <svg
                className="w-6 h-6 text-wite-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </div>

            <div className="flex-1">
              <div className="text-xs text-gray-400">Wind</div>

              {/* CLICK TO TOGGLE UNIT */}
              <div
                className="text-base font-bold text-white cursor-pointer select-none transition-opacity duration-150 hover:opacity-80"
                onClick={toggleUnit}
              >
                {direction} {getUnitValue()}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center pt-1 border-t border-slate-700">
            {formatDate(previewTime)}
          </div>
        </div>
      </div>

      {/* Mobile slider */}
      <div className="md:hidden absolute bottom-[35px] left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatDate(timeRange.min)}
            </span>
            <div className="flex-1" />
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatDate(timeRange.max)}
            </span>
          </div>

          <input
            type="range"
            min={timeRange.min.getTime()}
            max={timeRange.max.getTime()}
            step={3600000}
            value={previewTime.getTime()}
            onChange={(e) => onTimeChange(new Date(parseInt(e.target.value)))}
            className="w-full accent-red-500 h-2 rounded"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${progress}%, #475569 ${progress}%, #475569 100%)`,
            }}
          />
        </div>
      </div>

      {/* Desktop slider */}
      <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-1/2 min-w-[500px]">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-400 whitespace-nowrap">
              {formatDate(timeRange.min)}
            </span>
            <div className="flex-1" />
            <span className="text-sm text-gray-400 whitespace-nowrap">
              {formatDate(timeRange.max)}
            </span>
          </div>

          <input
            type="range"
            min={timeRange.min.getTime()}
            max={timeRange.max.getTime()}
            step={3600000}
            value={previewTime.getTime()}
            onChange={(e) => onTimeChange(new Date(parseInt(e.target.value)))}
            className="w-full accent-red-500 h-2 rounded cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${progress}%, #475569 ${progress}%, #475569 100%)`,
            }}
          />
        </div>
      </div>
    </>
  );
}
