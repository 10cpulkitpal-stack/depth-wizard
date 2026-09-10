'use client'

import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BuildStatus({
  steps,
  current,
  ready,
  onOpen,
}: {
  steps: { id: string; label: string }[]
  current: number
  ready: boolean
  onOpen: () => void
}) {
  return (
    <div className="w-full rounded-xl border border-border bg-card/90 p-4 shadow-xl backdrop-blur">
      <div className="flex items-center gap-2">
        {!ready && (
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-green" />
          </span>
        )}
        <p className="label-mono">{ready ? 'Terrain ready' : 'Building terrain'}</p>
      </div>

      <ol className="mt-4 space-y-2.5">
        {steps.map((s, i) => {
          const done = ready || i < current
          const active = !ready && i === current
          return (
            <li key={s.id} className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border',
                  done && 'border-brand-green bg-brand-green text-brand-green-fg',
                  active && 'border-primary',
                  !done && !active && 'border-border',
                )}
              >
                {done ? (
                  <Check className="size-3" strokeWidth={3} />
                ) : active ? (
                  <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                ) : (
                  <span className="size-1.5 rounded-full bg-border" />
                )}
              </span>
              <span
                className={cn(
                  'text-sm',
                  done || active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {s.label}
              </span>
            </li>
          )
        })}
      </ol>

      {ready && (
        <button
          type="button"
          onClick={onOpen}
          className="mt-5 flex w-full items-center justify-between rounded-lg bg-brand-green px-4 py-3 text-sm font-semibold text-brand-green-fg transition-colors hover:bg-brand-green/90"
        >
          Open 3D viewer
          <ArrowRight className="size-4" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
