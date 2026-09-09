'use client'

import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

export function ReliefSlider({
  value,
  onChange,
  className,
  orientation = 'horizontal',
}: {
  value: number
  onChange: (v: number) => void
  className?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card/95 p-3 shadow-[0_2px_12px_rgba(28,28,26,0.06)] backdrop-blur',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-6">
        <span className="label-mono">Relief</span>
        <span className="font-mono text-xs text-foreground">{value.toFixed(1)}×</span>
      </div>
      <div className="mt-3">
        <Slider
          value={[value]}
          min={0.5}
          max={3}
          step={0.1}
          orientation={orientation}
          onValueChange={(v) => onChange((Array.isArray(v) ? v[0] : v) as number)}
        />
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-text-muted">
        <span>0.5×</span>
        <span>3×</span>
      </div>
    </div>
  )
}
