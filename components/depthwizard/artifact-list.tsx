'use client'

import { Download, FileImage, FileText, File as FileIcon, Box } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Artifact } from '@/lib/depthwizard'

function iconFor(format: string): LucideIcon {
  if (format === 'PNG') return FileImage
  if (format === 'GLB') return Box
  if (format === 'NPY') return FileText
  return FileIcon
}

export function ArtifactList({
  artifacts,
  onDownload,
  className,
}: {
  artifacts: Artifact[]
  onDownload?: (a: Artifact) => void
  className?: string
}) {
  return (
    <ul className={cn('divide-y divide-border rounded-lg border border-border bg-card', className)}>
      {artifacts.map((a) => {
        const Icon = iconFor(a.format)
        return (
          <li
            key={a.id}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/60"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
              <Icon className="size-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">{a.name}</p>
                <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                  {a.format}
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">{a.description}</p>
            </div>
            <span className="hidden font-mono text-[11px] text-text-muted sm:block">{a.size}</span>
            <button
              type="button"
              onClick={() => onDownload?.(a)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-brand-green transition-colors hover:bg-primary/10"
            >
              <Download className="size-3.5" strokeWidth={1.75} />
              Download
            </button>
          </li>
        )
      })}
    </ul>
  )
}
