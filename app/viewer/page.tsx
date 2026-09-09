'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { Download, Expand, LogOut, Pause, Play, RotateCcw, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BrandLockup } from '@/components/depthwizard/logo'
import { ViewerToolbar } from '@/components/depthwizard/viewer-toolbar'
import { HeightProbe } from '@/components/depthwizard/height-probe'
import { ExportDrawer } from '@/components/depthwizard/export-drawer'
import { SettingsPanel } from '@/components/depthwizard/settings-panel'
import {
  TerrainViewer,
  DEFAULT_CONTROLS,
  type TerrainControls,
  type ProbeReading,
} from '@/components/depthwizard/terrain-viewer'
import { artifactUrl } from '@/lib/api'
import { type Artifact } from '@/lib/depthwizard'

const RELIEF_STOPS = [0.5, 1, 2, 3]

function download(a: Artifact) {
  const link = document.createElement('a')
  link.href = artifactUrl('job_8f21c4', a.id)
  link.download = a.id
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function TopButton({
  onClick,
  href,
  icon: Icon,
  children,
  active,
}: {
  onClick?: () => void
  href?: string
  icon: typeof Settings
  children: React.ReactNode
  active?: boolean
}) {
  const cls = cn(
    'inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur transition-colors',
    active
      ? 'bg-primary/10 text-primary'
      : 'bg-card/95 text-foreground hover:bg-secondary',
  )
  const inner = (
    <>
      <Icon className="size-4" strokeWidth={1.75} />
      {children}
    </>
  )
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

export default function ViewerPage() {
  const [controls, setControls] = useState<TerrainControls>({
    ...DEFAULT_CONTROLS,
    cameraMode: 'orbit',
  })
  const [probe, setProbe] = useState<ProbeReading | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const shellRef = useRef<HTMLDivElement>(null)

  // Camera mode changes also govern the tour: entering "tour" starts it playing,
  // switching to orbit/fly immediately stops it.
  const update = useCallback((patch: Partial<TerrainControls>) => {
    setControls((c) => {
      const next = { ...c, ...patch }
      if (patch.cameraMode && patch.cameraMode !== 'tour') next.tourPaused = false
      if (patch.cameraMode === 'tour') next.tourPaused = false
      return next
    })
  }, [])

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return
    const el = shellRef.current
    if (!document.fullscreenElement) el?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  const isTour = controls.cameraMode === 'tour'
  const isFly = controls.cameraMode === 'fly'

  return (
    <div ref={shellRef} className="relative h-screen w-screen overflow-hidden bg-background">
      <TerrainViewer
        controls={controls}
        onProbe={setProbe}
        resetSignal={resetSignal}
        className="absolute inset-0"
      />

      {/* Top-left brand + label */}
      <div className="absolute left-4 top-4 rounded-lg border border-border bg-card/90 px-3 py-2 shadow-sm backdrop-blur">
        <BrandLockup />
        <p className="label-mono mt-2 border-t border-border pt-1.5">3D Terrain Viewer</p>
      </div>

      {/* Top-right actions */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <TopButton href="/result" icon={LogOut}>
          <span className="hidden sm:inline">Exit Viewer</span>
        </TopButton>
        <TopButton onClick={() => setExportOpen(true)} icon={Download}>
          <span className="hidden sm:inline">Export</span>
        </TopButton>
        <TopButton
          onClick={() => setShowSettings((s) => !s)}
          icon={Settings}
          active={showSettings}
        >
          <span className="hidden sm:inline">Settings</span>
        </TopButton>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute left-4 top-28">
          <SettingsPanel controls={controls} onChange={update} />
          <button
            type="button"
            onClick={toggleFullscreen}
            className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-lg transition-colors hover:bg-secondary"
          >
            <Expand className="size-4" strokeWidth={1.75} />
            Toggle fullscreen
          </button>
        </div>
      )}

      {/* Right relief control + camera reset */}
      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        <div className="rounded-lg border border-border bg-card/95 p-2 shadow-sm backdrop-blur">
          <p className="label-mono mb-2 px-1 text-center">Terrain Relief</p>
          <div className="flex flex-col gap-1">
            {RELIEF_STOPS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => update({ relief: r })}
                className={cn(
                  'rounded-md px-3 py-1.5 font-mono text-xs transition-colors',
                  Math.abs(controls.relief - r) < 0.05
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                {r}×
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setResetSignal((n) => n + 1)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card/95 px-3 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.75} />
          Reset
        </button>
      </div>

      {/* Height probe */}
      {probe && (
        <div className="absolute bottom-24 right-4 sm:bottom-4">
          <HeightProbe reading={probe} />
        </div>
      )}

      {/* Tour pause control */}
      {isTour && (
        <div className="absolute left-1/2 top-4 -translate-x-1/2">
          <button
            type="button"
            onClick={() => update({ tourPaused: !controls.tourPaused })}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/95 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary"
          >
            {controls.tourPaused ? (
              <Play className="size-4" strokeWidth={1.75} />
            ) : (
              <Pause className="size-4" strokeWidth={1.75} />
            )}
            {controls.tourPaused ? 'Resume Tour' : 'Pause Tour'}
          </button>
        </div>
      )}

      {/* Fly-mode hint */}
      {isFly && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-md border border-border bg-card/95 px-4 py-2 text-center shadow-sm backdrop-blur">
          <p className="font-mono text-xs text-foreground">W A S D to move</p>
          <p className="font-mono text-[11px] text-text-muted">Mouse to look · Q / E for height</p>
        </div>
      )}

      {/* Bottom toolbar */}
      <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
        <ViewerToolbar controls={controls} onChange={update} className="max-w-full" />
      </div>

      <ExportDrawer open={exportOpen} onClose={() => setExportOpen(false)} onDownload={download} />
    </div>
  )
}
