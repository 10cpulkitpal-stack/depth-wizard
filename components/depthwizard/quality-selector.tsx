'use client'

import { Gauge, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InferenceQuality } from '@/lib/depthwizard'

const OPTIONS: {
  value: InferenceQuality
  label: string
  icon: typeof Zap
  hint: string
}[] = [
  { value: 'fast', label: 'Fast', icon: Zap, hint: '1 pass' },
  { value: 'quality', label: 'Quality', icon: Gauge, hint: '2 passes' },
]

export function QualitySelector({
  value,
  onChange,
}: {
  value: InferenceQuality
  onChange: (v: InferenceQuality) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-secondary p-1">
      {OPTIONS.map((o) => {
        const active = value === o.value
        const Icon = o.icon
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} />
            {o.label}
            <span className="font-mono text-[10px] text-text-muted">{o.hint}</span>
          </button>
        )
      })}
    </div>
  )
}
