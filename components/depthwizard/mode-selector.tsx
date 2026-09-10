'use client'

import { cn } from '@/lib/utils'

export type ViewMode = 'original' | 'depth' | 'scene'

const MODES: { value: ViewMode; label: string }[] = [
  { value: 'original', label: 'Original' },
  { value: 'depth', label: 'Depth' },
  { value: 'scene', label: '3D' },
]

export function ModeSelector({
  value,
  onChange,
  className,
}: {
  value: ViewMode
  onChange: (v: ViewMode) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 rounded-lg border border-border bg-card/80 p-1 shadow-sm backdrop-blur',
        className,
      )}
      role="tablist"
      aria-label="View mode"
    >
      {MODES.map((m) => {
        const active = value === m.value
        return (
          <button
            key={m.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
