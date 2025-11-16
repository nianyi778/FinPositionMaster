import type { ChangeEvent, ReactNode } from "react";

const ROLE_COLORS: Record<string, string> = {
  core: "#3A82F7",
  defense: "#4CAF50",
  offense: "#EF5350",
  custom: "#9C27B0",
};

type RoleSliderProps = {
  label: string;
  value: number;
  deviation?: number;
  hint?: ReactNode;
  roleKey?: string;
  onChange?: (value: number) => void;
};

function RoleSlider({
  label,
  value,
  deviation,
  hint,
  roleKey,
  onChange,
}: RoleSliderProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  const fillStyle = {
    width: `${safeValue}%`,
    backgroundColor: ROLE_COLORS[roleKey ?? "core"],
  };
  const hasDeviation = deviation !== undefined;
  const targetValue = hasDeviation
    ? Math.max(0, Math.min(100, safeValue - deviation))
    : safeValue;
  const deviationDirection = deviation ?? 0;
  const deviationWidth = Math.min(
    100,
    Math.max(0, Math.abs(deviationDirection)),
  );
  const deviationStart = deviationDirection > 0 ? targetValue : safeValue;
  const deviationStyle = {
    left: `${deviationStart}%`,
    width: `${Math.min(100 - deviationStart, deviationWidth)}%`,
    backgroundColor:
      deviationDirection > 0
        ? `${ROLE_COLORS[roleKey ?? "core"]}55`
        : "rgba(209, 213, 219, 0.6)",
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    onChange?.(nextValue);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between font-semibold text-foreground text-sm">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-border">
        <div
          className="absolute inset-0 h-full rounded-full bg-muted"
          style={{ width: `${targetValue}%` }}
        />
        <div
          className="absolute inset-0 h-full rounded-full"
          style={fillStyle}
        />
        {hasDeviation && deviationWidth > 0 ? (
          <div
            className="absolute top-0 h-full rounded-full"
            style={deviationStyle}
          />
        ) : null}
        <input
          type="range"
          min={0}
          max={100}
          value={safeValue}
          onChange={handleChange}
          aria-label={`${label} 百分比`}
          className={`absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent ${
            onChange ? "" : "pointer-events-none"
          }`}
        />
      </div>
      {(deviation !== undefined || hint) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
          {deviation !== undefined && (
            <span>
              目标 {targetValue}% · 偏离 {deviation > 0 ? "+" : ""}
              {deviation}%
            </span>
          )}
          {hint && <span>{hint}</span>}
        </div>
      )}
    </div>
  );
}

export { RoleSlider };
