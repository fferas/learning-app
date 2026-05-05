interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  color?: "blue" | "green" | "amber";
}

const colorClasses = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  amber: "bg-amber-400",
};

export function ProgressBar({
  value,
  label,
  color = "blue",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {label && (
        <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      )}
      <div
        className="h-3 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
