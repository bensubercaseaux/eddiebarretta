// Animated equalizer bars. Decorative cue for "live music"; static under
// prefers-reduced-motion (handled in globals.css via .eq-bar).
export function Equalizer({
  bars = 5,
  className = "",
}: {
  bars?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="eq-bar w-[3px] origin-bottom rounded-full bg-accent"
          style={{
            height: "1rem",
            animation: `eq ${0.85 + (i % 3) * 0.3}s ease-in-out ${i * 0.13}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
