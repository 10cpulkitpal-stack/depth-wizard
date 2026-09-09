'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Expand, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BrandLockup } from '@/components/depthwizard/logo'
import { ViewerToolbar } from '@/components/depthwizard/viewer-toolbar'
import { HeightProbe } from '@/components/depthwizard/height-probe'
import { ExportDrawer } from '@/components/depthwizard/export-drawer'
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
}: {
  onClick?: () => void
  href?: string
  icon: typeof Settings
  children: React.ReactNode
}) {
  const cls =
    'inline-flex items-center gap-1.5 rounded-md border border-border bg-card/95 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary'
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

  const update = (patch: Partial<TerrainControls>) =>
    setControls((c) => ({ ...c, ...patch }))

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <TerrainViewer controls={controls} onProbe={setProbe} className="absolute inset-0" />

      {/* Top-left brand */}
      <div className="absolute left-4 top-4 rounded-lg border border-border bg-card/90 px-3 py-2 shadow-sm backdrop-blur">
        <BrandLockup />
      </div>

      {/* Top-right actions */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <TopButton href="/result" icon={LogOut}>
          <span className="hidden sm:inline">Exit Viewer</span>
        </TopButton>
        <TopButton onClick={() => setExportOpen(true)} icon={Download}>
          <span className="hidden sm:inline">Export</span>
        </TopButton>
        <TopButton onClick={() => setShowSettings((s) => !s)} icon={Settings}>
          <span className="hidden sm:inline">Settings</span>
        </TopButton>
      </div>

      {/* Settings popover */}
      {showSettings && (
        <div className="absolute right-4 top-16 w-64 rounded-lg border border-border bg-card p-4 shadow-lg">
          <p className="label-mono mb-3">Camera controls</p>
          <dl className="space-y-2 text-xs">
            {[
              ['Orbit', 'Left mouse drag'],
              ['Pan', 'Right mouse drag'],
              ['Zoom', 'Scroll'],
              ['Fly', 'W A S D · Q / E'],
              ['Tour', 'Automatic camera'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-mono text-[11px] text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Expand className="size-4" strokeWidth={1.75} />
            Fullscreen
          </button>
        </div>
      )}

      {/* Right relief control */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg border border-border bg-card/95 p-2 shadow-sm backdrop-blur">
        <p className="label-mono mb-2 px-1 text-center">Relief</p>
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

      {/* Height probe (shows once terrain is sampled) */}
      {probe && (
        <div className="absolute left-4 top-24">
          <HeightProbe reading={probe} />
        </div>
      )}

      {/* Bottom toolbar */}
      <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
        <ViewerToolbar controls={controls} onChange={update} className="max-w-full" />
      </div>

      {/* Camera hint */}
      <div className="absolute bottom-4 left-4 hidden font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted lg:block">
        Orbit · drag &nbsp;/&nbsp; Zoom · scroll &nbsp;/&nbsp; Fly · WASD
      </div>

      <ExportDrawer open={exportOpen} onClose={() => setExportOpen(false)} onDownload={download} />
    </div>
  )
}
