import { Wind } from "lucide-react";

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
  const formatDate = (date: Date) => {
    return date.toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCompassDirection = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(((degrees % 360) / 45)) % 8;
    return directions[index];
  };

  const speedKmh = windData ? (windData.speed * 3.6).toFixed(1) : "—";
  const speedKnots = windData ? (windData.speed * 1.944).toFixed(1) : "—";
  const direction = windData ? getCompassDirection(windData.dir) : "—";

  const progress = 
    ((previewTime.getTime() - timeRange.min.getTime()) /
    (timeRange.max.getTime() - timeRange.min.getTime())) * 100;

  return (
    <>
      {/* Wind Info Box - Mobile & Desktop */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xs">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 flex items-center justify-center bg-red-500/20 rounded-full"
              style={windData ? { transform: `rotate(${windData.dir}deg)` } : {}}
            >
              <Wind className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400">Wind at cursor</div>
              <div className="text-lg font-bold text-white">
                {direction} {speedKmh} km/h
              </div>
              <div className="text-xs text-gray-400">{speedKnots} kn</div>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 text-center pt-2 border-t border-slate-700">
            {formatDate(previewTime)}
          </div>
        </div>
      </div>

      {/* Time Slider - Mobile */}
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

      {/* Time Slider - Desktop */}
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