import { useEffect, useRef } from "react";

interface TimeRangeSliderProps {
  timeRange: number;
  onTimeRangeChange: (value: number) => void;
}

export default function TimeRangeSlider({ timeRange, onTimeRangeChange }: TimeRangeSliderProps) {
  const sliderRef = useRef<HTMLInputElement>(null);

  const formatTime = (value: number) => {
    const hour = Math.floor(value);
    const minute = (value % 1) * 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (sliderRef.current) {
      const percentage = ((timeRange - 9) / (23.5 - 9)) * 100;
      sliderRef.current.style.setProperty('--value', `${percentage}%`);
    }
  }, [timeRange]);

  return (
    <div>
      <label className="block text-sm font-medium mb-4">Preferred Time Range</label>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground w-12">9:00</span>
          <input
            ref={sliderRef}
            type="range"
            min="9"
            max="23.5"
            step="0.5"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer range-slider"
            data-testid="time-range-slider"
          />
          <span className="text-sm text-muted-foreground w-12">23:30</span>
        </div>
        <div className="text-center">
          <span className="text-sm text-muted-foreground">Selected: </span>
          <span 
            className="font-medium"
            data-testid="time-range-display"
          >
            {formatTime(timeRange)}
          </span>
        </div>
      </div>
    </div>
  );
}
