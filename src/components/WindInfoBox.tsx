interface WindInfoBoxProps {
  wind: { speed: number; dir: number };
}

export function WindInfoBox({ wind }: WindInfoBoxProps) {
  return (
    <div
      className="
        absolute top-4 left-4 md:top-6 md:left-6
        bg-slate-900/70 backdrop-blur-md
        px-4 py-2 rounded-xl shadow-lg
        text-sm text-white
        flex items-center gap-2
        z-50
      "
    >
      <span className="text-lg">Wiatr:</span>
      <div>
        <div>{wind.speed.toFixed(1)} m/s ({(wind.speed * 1.94384).toFixed(1)} kn)</div>
      </div>
    </div>
  );
}
