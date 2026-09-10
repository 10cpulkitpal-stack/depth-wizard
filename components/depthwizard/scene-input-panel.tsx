'use client'

import { useRef, useState } from 'react'
import { ArrowRight, Check, FileImage, Layers, Ruler, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { QualitySelector } from './quality-selector'
import type { InferenceQuality } from '@/lib/depthwizard'
import type { SceneInput } from '@/lib/scene-store'

const ACCEPT = '.tif,.tiff,.png,.jpg,.jpeg'

function OptionToggle({
  active,
  label,
  hint,
  icon: Icon,
  onClick,
}: {
  active: boolean
  label: string
  hint: string
  icon: typeof Layers
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
        active
          ? 'border-primary/40 bg-primary/[0.06]'
          : 'border-border bg-secondary/40 hover:border-ring',
      )}
    >
      <span
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-md border',
          active ? 'border-primary/40 text-primary' : 'border-border text-text-muted',
        )}
      >
        {active ? <Check className="size-3.5" strokeWidth={2.5} /> : <Icon className="size-3.5" strokeWidth={1.75} />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{active ? 'Attached' : hint}</span>
      </span>
    </button>
  )
}

export function SceneInputPanel({
  scene,
  onScene,
  quality,
  onQuality,
  acquisition,
  onAcquisition,
  hasRef,
  onRef,
  hasDsm,
  onDsm,
  onAnalyze,
}: {
  scene: SceneInput
  onScene: (s: SceneInput) => void
  quality: InferenceQuality
  onQuality: (q: InferenceQuality) => void
  acquisition: string
  onAcquisition: (v: string) => void
  hasRef: boolean
  onRef: () => void
  hasDsm: boolean
  onDsm: () => void
  onAnalyze: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () =>
      onScene({
        textureUrl: url,
        fileName: file.name,
        width: img.naturalWidth || 1024,
        height: img.naturalHeight || 1024,
        demo: false,
      })
    img.onerror = () =>
      onScene({ textureUrl: url, fileName: file.name, width: 1024, height: 1024, demo: false })
    img.src = url
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card/90 shadow-xl backdrop-blur">
      <header className="border-b border-border px-4 py-3">
        <p className="label-mono">Scene input</p>
        <h1 className="mt-1 text-base font-semibold tracking-tight text-foreground">
          Prepare an orbital scene
        </h1>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {/* Raster */}
        <section>
          <p className="label-mono mb-2">Source raster</p>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDrag(true)
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDrag(false)
              handleFiles(e.dataTransfer.files)
            }}
            className={cn(
              'overflow-hidden rounded-lg border transition-colors',
              drag ? 'border-primary/60 bg-primary/[0.06]' : 'border-border bg-secondary/40',
            )}
          >
            <div className="flex items-center gap-3 p-3">
              <span className="size-12 shrink-0 overflow-hidden rounded-md border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={scene.textureUrl || '/placeholder.svg'} alt="Selected raster preview" className="size-full object-cover" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
                  <FileImage className="size-3.5 shrink-0 text-brand-green" strokeWidth={1.75} />
                  {scene.fileName}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-text-muted">
                  {scene.width} × {scene.height}
                  {scene.demo && <span className="ml-1.5 rounded bg-secondary px-1 py-0.5 text-[10px] text-muted-foreground">DEMO</span>}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full items-center justify-center gap-1.5 border-t border-border py-2 text-xs font-medium text-brand-green transition-colors hover:bg-secondary/60"
            >
              <Upload className="size-3.5" strokeWidth={1.75} />
              {scene.demo ? 'Upload your raster' : 'Replace raster'}
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            GeoTIFF or RGB image. Drag a file onto the tile to replace.
          </p>
        </section>

        {/* Inference */}
        <section>
          <p className="label-mono mb-2">Inference quality</p>
          <QualitySelector value={quality} onChange={onQuality} />
        </section>

        {/* Acquisition */}
        <section>
          <label className="label-mono mb-2 block" htmlFor="acq">
            Acquisition time
          </label>
          <input
            id="acq"
            type="text"
            value={acquisition}
            onChange={(e) => onAcquisition(e.target.value)}
            placeholder="e.g. 2021-06-14 10:32 UTC"
            className="h-9 w-full rounded-lg border border-border bg-secondary/40 px-3 font-mono text-xs text-foreground outline-none placeholder:text-text-muted focus:border-ring"
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Enables shadow-based metric calibration when provided.
          </p>
        </section>

        {/* Optional inputs */}
        <section className="space-y-2">
          <p className="label-mono mb-1">Optional references</p>
          <OptionToggle
            active={hasRef}
            onClick={onRef}
            icon={Ruler}
            label="Reference DEM"
            hint="Scale calibration"
          />
          <OptionToggle
            active={hasDsm}
            onClick={onDsm}
            icon={Layers}
            label="Ground-truth DSM"
            hint="Benchmark evaluation"
          />
        </section>
      </div>

      <footer className="border-t border-border p-3">
        <Button
          className="h-10 w-full bg-brand-green text-brand-green-fg hover:bg-brand-green/90"
          onClick={onAnalyze}
        >
          Analyze terrain
          <ArrowRight />
        </Button>
      </footer>
    </div>
  )
}
