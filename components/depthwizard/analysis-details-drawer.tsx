'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DataRows } from './technical-info'
import { ANALYSIS_DETAILS, SPATIAL_CONTEXT, TECHNICAL_NOTES } from '@/lib/depthwizard'

function Heading({ children }: { children: React.ReactNode }) {
  return <p className="label-mono mb-2">{children}</p>
}

export function AnalysisDetailsDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-opacity',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[1px]" onClick={onClose} />
      <aside
        role="dialog"
        aria-label="Analysis details"
        className={cn(
          'absolute left-0 top-0 flex h-full w-full max-w-sm flex-col border-r border-border bg-card shadow-xl transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Analysis details</h2>
            <p className="mt-0.5 font-mono text-[11px] text-text-muted">
              Relative depth · scale-ambiguous
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto p-5">
          <section>
            <Heading>Analysis</Heading>
            <DataRows rows={ANALYSIS_DETAILS} className="grid-cols-1 sm:grid-cols-1" />
          </section>

          <section>
            <Heading>Spatial context</Heading>
            <DataRows rows={SPATIAL_CONTEXT} className="grid-cols-1 sm:grid-cols-1" />
          </section>

          <section>
            <Heading>Benchmark fit</Heading>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-4">
              <span className="flex size-8 items-center justify-center rounded-full border border-border bg-card font-mono text-xs text-text-muted">
                —
              </span>
              <p className="text-sm text-muted-foreground">No reference metrics for this scene.</p>
            </div>
          </section>

          <section>
            <Heading>Technical notes</Heading>
            <div className="space-y-2.5">
              {TECHNICAL_NOTES.map((n) => (
                <div key={n.id} className="rounded-lg border border-border bg-secondary/40 p-3.5">
                  <p className="label-mono">{n.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{n.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
