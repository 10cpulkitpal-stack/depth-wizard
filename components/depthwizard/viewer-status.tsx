'use client'

import { cn } from '@/lib/utils'
import type { SceneInput } from '@/lib/scene-store'

export function ViewerStatus({
  scene,
  mesh,
  buildings,
  className,
}: {
  scene: SceneInput
  mesh: number
  buildings: number
  className?: string
}) {
  const rows = [
    { k: 'RGB Texture', v: `${scene.width} × ${scene.height}` },
    { k: 'Depth', v: scene.demo ? 'Relative · demo' : 'Relative' },
    { k: 'Mesh', v: `${mesh} × ${mesh}` },
    { k: 'Buildings', v: String(buildings) },
  ]
  return (
    <div
      className={cn(
        'w-44 rounded-lg border border-border bg-card/80 p-2.5 shadow-sm backdrop-blur',
        className,
      )}
    >
      <div className="grid gap-1.5">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between gap-4">
            <span className="label-mono">{r.k}</span>
            <span className="font-mono text-[11px] text-foreground">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
