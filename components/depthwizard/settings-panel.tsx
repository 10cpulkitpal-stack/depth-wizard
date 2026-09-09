'use client'

import { cn } from '@/lib/utils'
import type { TerrainControls, Quality } from './terrain-viewer'

function SegRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="label-mono">{label}</span>
      <div className="flex items-center gap-0.5 rounded-md border border-border bg-background p-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded px-2 py-1 font-mono text-[11px] transition-colors',
              value === o.value
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="label-mono">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          'relative h-5 w-9 rounded-full border border-border transition-colors',
          value ? 'bg-primary' : 'bg-secondary',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-3.5 rounded-full bg-card shadow-sm transition-transform',
            value ? 'translate-x-4' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}

export function SettingsPanel({
  controls,
  onChange,
  className,
}: {
  controls: TerrainControls
  onChange: (patch: Partial<TerrainControls>) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-64 rounded-lg border border-border bg-card p-4 shadow-lg',
        className,
      )}
    >
      <p className="label-mono mb-3">Scene settings</p>
      <div className="space-y-3">
        <SegRow<Quality>
          label="Quality"
          value={controls.quality}
          onChange={(v) => onChange({ quality: v })}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Med' },
            { value: 'high', label: 'High' },
          ]}
        />
        <Toggle
          label="Shadows"
          value={controls.shadows}
          onChange={(v) => onChange({ shadows: v })}
        />
        <Toggle
          label="Atmosphere"
          value={controls.atmosphere}
          onChange={(v) => onChange({ atmosphere: v })}
        />
        <Toggle
          label="Auto rotate"
          value={controls.autoRotate}
          onChange={(v) => onChange({ autoRotate: v })}
        />
      </div>
    </div>
  )
}
