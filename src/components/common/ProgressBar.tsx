import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string; // e.g. '#5856D6'
  height?: string;
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#5856D6',
  height = 'h-2',
  showLabel = false,
  label
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
          <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-[#25252D] rounded-full overflow-hidden ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
