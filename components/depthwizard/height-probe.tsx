'use client'

import { Crosshair } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProbeReading } from './terrain-viewer'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 py-1">
      <span className="label-mono">{label}</span>
      <span className="font-mono text-xs text-foreground">{value}</span>
    </div>
  )
}

export function HeightProbe({
  reading,
  className,
}: {
  reading: ProbeReading | null
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-52 rounded-lg border border-border bg-card/95 p-3 shadow-[0_2px_12px_rgba(28,28,26,0.06)] backdrop-blur',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border pb-2">
        <Crosshair className="size-3.5 text-brand-green" strokeWidth={1.75} />
        <span className="label-mono">Height Probe</span>
      </div>
      {reading ? (
        <div className="mt-1.5">
          <Row label="X" value={reading.x.toFixed(1)} />
          <Row label="Y" value={reading.y.toFixed(1)} />
          <Row label="Elevation" value={`${reading.elevation.toFixed(1)} m`} />
          <Row label="Slope" value={`${reading.slope.toFixed(1)}°`} />
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Click the terrain surface to sample elevation and slope.
        </p>
      )}
    </div>
  )
}
