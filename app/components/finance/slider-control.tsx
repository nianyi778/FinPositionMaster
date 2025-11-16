import * as Slider from "@radix-ui/react-slider";
import type { CSSProperties } from "react";

type SliderControlProps = {
  value: number;
  onValueChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  trackStyle?: CSSProperties;
  rangeStyle?: CSSProperties;
  thumbStyle?: CSSProperties;
  className?: string;
};

function SliderControl({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  trackStyle,
  rangeStyle,
  thumbStyle,
  className,
}: SliderControlProps) {
  return (
    <Slider.Root
      className={`relative flex h-2 w-full touch-none select-none items-center ${className ?? ""}`}
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(values) => {
        const next = values?.[0];
        if (next !== undefined) {
          onValueChange(next);
        }
      }}
      aria-label="percentage slider"
    >
      <Slider.Track
        className="relative h-1 w-full grow rounded-full bg-border"
        style={trackStyle}
      >
        <Slider.Range
          className="absolute h-full rounded-full bg-primary"
          style={rangeStyle}
        />
      </Slider.Track>
      <Slider.Thumb
        className="block h-4 w-4 rounded-full bg-primary shadow-[0_0_0_4px_rgb(59,130,246,0.2)]"
        style={thumbStyle}
      />
    </Slider.Root>
  );
}

export { SliderControl };
