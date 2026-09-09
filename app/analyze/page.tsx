'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, FileImage, Layers, Plus, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppTopBar } from '@/components/depthwizard/app-topbar'
import { QualitySelector } from '@/components/depthwizard/quality-selector'
import type { InferenceQuality } from '@/lib/depthwizard'
import { cn } from '@/lib/utils'

function StepLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm text-brand-green">{index}</span>
      <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
        {title}
      </span>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="label-mono mb-2">{children}</p>
}

export default function AnalyzePage() {
  const router = useRouter()
  const [quality, setQuality] = useState<InferenceQuality>('quality')
  const [acquisition, setAcquisition] = useState('')

  return (
    <div className="flex min-h-screen flex-col">
      <AppTopBar>
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </Link>
      </AppTopBar>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[380px_1fr]">
        {/* Left configuration panel */}
        <aside className="flex flex-col border-b border-border bg-card lg:border-b-0 lg:border-r">
          <div className="border-b border-border px-6 py-5">
            <StepLabel index="01" title="Scene input" />
            <p className="mt-1.5 text-sm text-muted-foreground">Prepare an orbital scene</p>
          </div>

          <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
            <section>
              <FieldLabel>RGB satellite image</FieldLabel>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                    <FileImage className="size-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">rgb_2021.tif</p>
                    <div className="mt-1 flex flex-wrap gap-2 font-mono text-[10px] text-text-muted">
                      <span>1024 × 1024</span>
                      <span className="text-border">·</span>
                      <span>GeoTIFF</span>
                      <span className="text-border">·</span>
                      <span>RGB</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Replace image
                </Button>
              </div>
            </section>

            <section>
              <FieldLabel>Inference quality</FieldLabel>
              <QualitySelector value={quality} onChange={setQuality} />
            </section>

            <section>
              <FieldLabel>Acquisition time (UTC)</FieldLabel>
              <input
                type="text"
                inputMode="numeric"
                placeholder="YYYY-MM-DD HH:MM"
                value={acquisition}
                onChange={(e) => setAcquisition(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-background px-3 font-mono text-sm text-foreground placeholder:text-text-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
              />
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Used for optional shadow-based metric calibration.
              </p>
            </section>

            <section>
              <FieldLabel>Reference elevation data</FieldLabel>
              <p className="mb-2 text-xs text-muted-foreground">
                Reference DEM / SRTM / GCP · optional
              </p>
              <button
                type="button"
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border border-dashed border-border bg-background px-4 py-3 text-left transition-colors hover:border-ring hover:bg-secondary/50',
                )}
              >
                <span className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground">
                  <Ruler className="size-4" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-foreground">Add reference</span>
                <Plus className="ml-auto size-4 text-text-muted" strokeWidth={1.75} />
              </button>
            </section>

            <section>
              <FieldLabel>Aligned DSM ground truth</FieldLabel>
              <p className="mb-2 text-xs text-muted-foreground">Optional benchmark surface</p>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-dashed border-border bg-background px-4 py-3 text-left transition-colors hover:border-ring hover:bg-secondary/50"
              >
                <span className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground">
                  <Layers className="size-4" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-foreground">Add DSM</span>
                <Plus className="ml-auto size-4 text-text-muted" strokeWidth={1.75} />
              </button>
            </section>
          </div>

          <div className="border-t border-border p-6">
            <Button
              onClick={() => router.push('/processing')}
              className="h-11 w-full bg-brand-green text-brand-green-fg hover:bg-brand-green/90"
            >
              Analyze Terrain
              <ArrowRight />
            </Button>
          </div>
        </aside>

        {/* Right preview area */}
        <main className="relative flex items-center justify-center bg-background p-6 lg:p-10">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="label-mono">Scene preview</span>
              <span className="font-mono text-[11px] text-text-muted">rgb_2021.tif</span>
            </div>
            <div className="relative aspect-square">
              {/* Satellite raster preview */}
              <img
                src="/textures/satellite.png"
                alt="RGB satellite raster preview of the terrain scene"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
                {['RGB', '1024 × 1024', 'GeoTIFF'].map((t) => (
                  <span
                    key={t}
                    className="w-fit rounded-md border border-border bg-card/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-foreground backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0 border-[12px] border-card/0" />
              <div className="pointer-events-none absolute bottom-3 right-3 rounded-md border border-border bg-card/90 px-2 py-1 font-mono text-[10px] text-text-muted backdrop-blur">
                EPSG:26985
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
