'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { X } from 'lucide-react'
import { ViewerTopBar } from '@/components/depthwizard/viewer-topbar'
import { SceneInputPanel } from '@/components/depthwizard/scene-input-panel'
import { BuildStatus } from '@/components/depthwizard/build-status'
import {
  TerrainViewer,
  DEFAULT_CONTROLS,
  type TerrainControls,
} from '@/components/depthwizard/terrain-viewer'
import { setScene as saveScene, getScene, DEFAULT_SCENE, type SceneInput } from '@/lib/scene-store'
import { BUILD_STEPS, type InferenceQuality } from '@/lib/depthwizard'

const INPUT_RELIEF = 0.12
const TARGET_RELIEF = 1.5
const STEP_MS = 850

type Phase = 'input' | 'building' | 'ready'

export default function AnalyzePage() {
  const router = useRouter()

  const [scene, setSceneState] = useState<SceneInput>(DEFAULT_SCENE)
  const [quality, setQuality] = useState<InferenceQuality>('quality')
  const [acquisition, setAcquisition] = useState('')
  const [hasRef, setHasRef] = useState(false)
  const [hasDsm, setHasDsm] = useState(false)

  const [phase, setPhase] = useState<Phase>('input')
  const [buildStep, setBuildStep] = useState(0)
  const [controls, setControls] = useState<TerrainControls>({
    ...DEFAULT_CONTROLS,
    cameraMode: 'orbit',
    autoRotate: true,
    probe: false,
    grid: true,
    buildings: false,
    relief: INPUT_RELIEF,
  })

  useEffect(() => setSceneState(getScene()), [])

  // Progressive build animation: raise the terrain out of a flat raster while
  // marching through the pipeline steps.
  useEffect(() => {
    if (phase !== 'building') return
    const total = BUILD_STEPS.length
    const duration = STEP_MS * total
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = t * t * (3 - 2 * t)
      setControls((c) => ({
        ...c,
        relief: INPUT_RELIEF + (TARGET_RELIEF - INPUT_RELIEF) * eased,
        buildings: t > 0.5,
      }))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const stepTimer = setInterval(() => {
      setBuildStep((s) => Math.min(total, s + 1))
    }, STEP_MS)

    const done = setTimeout(() => setPhase('ready'), duration + 200)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(stepTimer)
      clearTimeout(done)
    }
  }, [phase])

  const startBuild = useCallback(() => {
    saveScene(scene)
    setBuildStep(0)
    setPhase('building')
  }, [scene])

  const openViewer = useCallback(() => {
    saveScene(scene)
    router.push('/viewer')
  }, [scene, router])

  const stageActive = phase === 'input' ? 0 : 1

  return (
    <div className="dark relative h-screen w-screen overflow-hidden bg-background">
      <TerrainViewer
        theme="dark"
        textureUrl={scene.textureUrl}
        controls={controls}
        className="absolute inset-0"
      />

      <ViewerTopBar steps={['Satellite', 'Terrain', '3D Viewer']} active={stageActive}>
        <Link
          href="/"
          title="Cancel"
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">Cancel</span>
        </Link>
      </ViewerTopBar>

      {/* Left workspace panel */}
      <div className="absolute bottom-3 left-3 top-14 z-20 flex w-[340px] max-w-[calc(100vw-1.5rem)] flex-col">
        {phase === 'input' ? (
          <SceneInputPanel
            scene={scene}
            onScene={setSceneState}
            quality={quality}
            onQuality={setQuality}
            acquisition={acquisition}
            onAcquisition={setAcquisition}
            hasRef={hasRef}
            onRef={() => setHasRef((v) => !v)}
            hasDsm={hasDsm}
            onDsm={() => setHasDsm((v) => !v)}
            onAnalyze={startBuild}
          />
        ) : (
          <BuildStatus
            steps={BUILD_STEPS}
            current={buildStep}
            ready={phase === 'ready'}
            onOpen={openViewer}
          />
        )}
      </div>

      {/* Scene badge */}
      <div className="absolute right-3 top-14 z-20 rounded-lg border border-border bg-card/80 px-3 py-2 shadow-sm backdrop-blur">
        <p className="label-mono">{scene.demo ? 'Demo terrain' : 'Uploaded scene'}</p>
        <p className="mt-0.5 max-w-40 truncate font-mono text-[11px] text-foreground">{scene.fileName}</p>
      </div>
    </div>
  )
}
