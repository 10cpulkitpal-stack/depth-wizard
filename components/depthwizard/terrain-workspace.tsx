'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  TerrainViewer,
  DEFAULT_CONTROLS,
  type TerrainControls,
  type ProbeReading,
} from './terrain-viewer'
import { ViewerToolbar } from './viewer-toolbar'
import { ReliefSlider } from './relief-slider'
import { HeightProbe } from './height-probe'

export function TerrainWorkspace({ className }: { className?: string }) {
  const [controls, setControls] = useState<TerrainControls>({ ...DEFAULT_CONTROLS })
  const [probe, setProbe] = useState<ProbeReading | null>(null)
  const update = (patch: Partial<TerrainControls>) =>
    setControls((c) => ({ ...c, ...patch }))

  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-border', className)}>
      <TerrainViewer controls={controls} onProbe={setProbe} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-3 top-3 flex justify-center">
        <ViewerToolbar
          controls={controls}
          onChange={update}
          className="pointer-events-auto max-w-full"
        />
      </div>

      <ReliefSlider
        className="absolute bottom-3 left-3 w-52"
        value={controls.relief}
        onChange={(v) => update({ relief: v })}
      />

      <HeightProbe className="absolute bottom-3 right-3" reading={probe} />
    </div>
  )
}
