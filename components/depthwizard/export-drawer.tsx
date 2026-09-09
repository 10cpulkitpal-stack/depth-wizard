'use client'

import { useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ARTIFACTS, type Artifact } from '@/lib/depthwizard'

export function ExportDrawer({
  open,
  onClose,
  onDownload,
}: {
  open: boolean
  onClose: () => void
  onDownload?: (a: Artifact) => void
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
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-label="Export terrain"
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-border bg-card shadow-xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Export terrain</h2>
            <p className="mt-0.5 font-mono text-[11px] text-text-muted">
              rgb_2021.tif · {ARTIFACTS.length} artifacts
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {ARTIFACTS.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{a.name}</p>
                  <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                    {a.format}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
                <button
                  type="button"
                  onClick={() => onDownload?.(a)}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-brand-green transition-colors hover:underline"
                >
                  <Download className="size-3.5" strokeWidth={1.75} />
                  Download {a.format}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <footer className="border-t border-border p-4">
          <Button
            className="h-10 w-full bg-brand-green text-brand-green-fg hover:bg-brand-green/90"
            onClick={() => ARTIFACTS.forEach((a) => onDownload?.(a))}
          >
            <Download />
            Download all artifacts
          </Button>
        </footer>
      </aside>
    </div>
  )
}
