interface WindInfoBoxProps {
  wind: { speed: number; dir: number };
}

export function WindInfoBox({ wind }: WindInfoBoxProps) {
  return (
    <div
      className="
        absolute
        top-0 left-0              /* mobile: przyklejony do lewego górnego rogu */
        w-[30%]                   /* mobile: szerokość 30% */
        md:top-4 md:left-6        /* desktop: większe marginesy */
        md:w-auto                 /* desktop: szerokość auto */
        bg-slate-800/95 backdrop-blur-md
        px-4 py-2 md:rounded-xl shadow-lg
        text-white
        flex flex-col items-center justify-center gap-1
        z-50
        h-[70px]
      "
    >
      <span className="text-md md:text-sm font-medium">Wiatr:</span>
      <div className="text-lg md:text-xl font-bold">
        {(wind.speed * 1.94384).toFixed(1)} kn
      </div>
    </div>
  );
}
