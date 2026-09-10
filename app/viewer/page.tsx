'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Download, Expand, Info, Pause, Play, Plus, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ViewerTopBar } from '@/components/depthwizard/viewer-topbar'
import { ViewerToolbar } from '@/components/depthwizard/viewer-toolbar'
import { ViewerStatus } from '@/components/depthwizard/viewer-status'
import { ModeSelector, type ViewMode } from '@/components/depthwizard/mode-selector'
import { HeightProbe } from '@/components/depthwizard/height-probe'
import { ReliefSlider } from '@/components/depthwizard/relief-slider'
import { ExportDrawer } from '@/components/depthwizard/export-drawer'
import { AnalysisDetailsDrawer } from '@/components/depthwizard/analysis-details-drawer'
import {
  TerrainViewer,
  DEFAULT_CONTROLS,
  type TerrainControls,
  type ProbeReading,
} from '@/components/depthwizard/terrain-viewer'
import { artifactUrl } from '@/lib/api'
import { type Artifact } from '@/lib/depthwizard'
import { getScene, DEFAULT_SCENE, type SceneInput } from '@/lib/scene-store'
import { getBuildingData } from '@/lib/mock-terrain'

const MESH_RES: Record<TerrainControls['quality'], number> = {
  low: 96,
  medium: 150,
  high: 210,
}

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
  active,
  label,
  icon: Icon,
}: {
  onClick: () => void
  active?: boolean
  label: string
  icon: typeof Info
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-pressed={active}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      )}
    >
      <Icon className="size-4" strokeWidth={1.75} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

export default function ViewerPage() {
  const [controls, setControls] = useState<TerrainControls>({
    ...DEFAULT_CONTROLS,
    cameraMode: 'orbit',
  })
  const [probe, setProbe] = useState<ProbeReading | null>(null)
  const [mode, setMode] = useState<ViewMode>('scene')
  const [exportOpen, setExportOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const [aerialSignal, setAerialSignal] = useState(0)
  const [scene, setSceneState] = useState<SceneInput>(DEFAULT_SCENE)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => setSceneState(getScene()), [])

  const buildings = useMemo(() => getBuildingData().length, [])

  const update = useCallback((patch: Partial<TerrainControls>) => {
    setControls((c) => {
      const next = { ...c, ...patch }
      if (patch.cameraMode) next.tourPaused = false
      return next
    })
  }, [])

  const aerialFly = useCallback(() => {
    setControls((c) => ({ ...c, cameraMode: 'orbit' }))
    setAerialSignal((n) => n + 1)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = shellRef.current
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen?.()
    else document.exitFullscreen?.()
  }, [])

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const isTour = controls.cameraMode === 'tour'
  const isFly = controls.cameraMode === 'fly'
  const isScene = mode === 'scene'

  return (
    <div ref={shellRef} className="dark relative h-screen w-screen overflow-hidden bg-background">
      <TerrainViewer
        theme="dark"
        textureUrl={scene.textureUrl}
        controls={controls}
        onProbe={controls.probe ? setProbe : undefined}
        resetSignal={resetSignal}
        aerialSignal={aerialSignal}
        className="absolute inset-0"
      />

      {/* Image modes overlay the 3D canvas */}
      {mode === 'original' && (
        <div className="absolute inset-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={scene.textureUrl || '/textures/satellite.png'} alt="Original RGB raster" className="size-full object-cover" />
          <span className="absolute bottom-4 left-4 rounded-md border border-border bg-card/80 px-2.5 py-1 label-mono backdrop-blur">
            Original · RGB
          </span>
        </div>
      )}
      {mode === 'depth' && (
        <div className="absolute inset-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/textures/depth.png" alt="Predicted relative depth" className="size-full object-cover" />
          <span className="absolute bottom-4 left-4 rounded-md border border-border bg-card/80 px-2.5 py-1 label-mono backdrop-blur">
            Predicted depth · relative
          </span>
        </div>
      )}

      <ViewerTopBar steps={['Satellite', 'Terrain', '3D Viewer']} active={2}>
        <TopButton onClick={() => setDetailsOpen(true)} label="Details" icon={Info} />
        <TopButton onClick={() => setExportOpen(true)} label="Export" icon={Download} />
        <Link
          href="/analyze"
          title="New upload"
          className="flex items-center gap-1.5 rounded-md bg-brand-green px-2.5 py-1.5 text-xs font-semibold text-brand-green-fg transition-colors hover:bg-brand-green/90"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span className="hidden sm:inline">New upload</span>
        </Link>
        <TopButton onClick={toggleFullscreen} active={isFullscreen} label="Fullscreen" icon={Expand} />
      </ViewerTopBar>

      {/* Mode selector */}
      <div className="absolute left-3 top-14 z-20">
        <ModeSelector value={mode} onChange={setMode} />
      </div>

      {/* Technical status */}
      <div className="absolute right-3 top-14 z-20">
        <ViewerStatus scene={scene} mesh={MESH_RES[controls.quality]} buildings={buildings} />
      </div>

      {/* Tour pause control */}
      {isScene && isTour && (
        <div className="absolute left-1/2 top-14 z-20 -translate-x-1/2">
          <button
            type="button"
            onClick={() => update({ tourPaused: !controls.tourPaused })}
            className="flex items-center gap-2 rounded-lg border border-border bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur"
          >
            {controls.tourPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            {controls.tourPaused ? 'Resume tour' : 'Pause tour'}
          </button>
        </div>
      )}

      {/* Relief + reset */}
      {isScene && (
        <div className="absolute bottom-4 left-3 z-20 flex flex-col gap-2">
          <ReliefSlider
            className="w-48"
            value={controls.relief}
            onChange={(v) => update({ relief: v })}
          />
          <button
            type="button"
            onClick={() => setResetSignal((n) => n + 1)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card/90 px-3 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.75} />
            Reset camera
          </button>
        </div>
      )}

      {/* Height probe */}
      {isScene && controls.probe && (
        <div className="absolute bottom-4 right-3 z-20">
          <HeightProbe reading={probe} />
        </div>
      )}

      {/* Fly hint */}
      {isScene && isFly && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 z-20 -translate-x-1/2">
          <p className="rounded-md border border-border bg-card/90 px-3 py-1.5 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur">
            Drag to steer · scroll to move
          </p>
        </div>
      )}

      {/* Main toolbar */}
      {isScene && (
        <div className="absolute inset-x-3 bottom-4 z-20 flex justify-center">
          <ViewerToolbar
            controls={controls}
            onChange={update}
            onAerialFly={aerialFly}
            className="max-w-full"
          />
        </div>
      )}

      <ExportDrawer open={exportOpen} onClose={() => setExportOpen(false)} onDownload={download} />
      <AnalysisDetailsDrawer open={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </div>
  )
}
