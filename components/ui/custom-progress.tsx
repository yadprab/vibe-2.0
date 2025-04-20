import { cn } from "@/lib/utils"

interface CustomProgressProps {
  value: number
  max?: number
  className?: string
  indicatorClassName?: string
}

export function CustomProgress({ value, max = 100, className, indicatorClassName }: CustomProgressProps) {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-[#ffd1dc]/30", className)}>
      <div
        className={cn("h-full bg-[#ffb6c1] transition-all", indicatorClassName)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
