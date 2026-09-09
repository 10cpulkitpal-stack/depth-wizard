'use client'

import {
  Box,
  Building2,
  Grid2x2,
  Image as ImageIcon,
  Layers,
  Orbit,
  Palette,
  Route,
  Spline,
  Waypoints,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TerrainControls } from './terrain-viewer'

type ToggleKey = keyof Pick<
  TerrainControls,
  'texture' | 'heightColors' | 'smooth' | 'block' | 'buildings' | 'wireframe' | 'grid'
>

const DISPLAY: { key: ToggleKey; label: string; icon: LucideIcon }[] = [
  { key: 'texture', label: 'RGB Texture', icon: ImageIcon },
  { key: 'heightColors', label: 'Height Colors', icon: Palette },
  { key: 'smooth', label: 'Smooth', icon: Spline },
  { key: 'block', label: '3D Block', icon: Box },
  { key: 'buildings', label: 'Buildings', icon: Building2 },
  { key: 'wireframe', label: 'Wireframe', icon: Layers },
  { key: 'grid', label: 'Grid', icon: Grid2x2 },
]

const CAMERA: { mode: TerrainControls['cameraMode']; label: string; icon: LucideIcon }[] = [
  { mode: 'orbit', label: 'Orbit', icon: Orbit },
  { mode: 'fly', label: 'Fly', icon: Route },
  { mode: 'tour', label: 'Tour', icon: Waypoints },
]

function Chip({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: LucideIcon
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      )}
    >
      <Icon className="size-3.5" strokeWidth={1.75} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

export function ViewerToolbar({
  controls,
  onChange,
  className,
}: {
  controls: TerrainControls
  onChange: (next: Partial<TerrainControls>) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card/95 p-1.5 shadow-[0_2px_12px_rgba(28,28,26,0.06)] backdrop-blur',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5">
        {DISPLAY.map((d) => (
          <Chip
            key={d.key}
            active={controls[d.key]}
            onClick={() => onChange({ [d.key]: !controls[d.key] })}
            icon={d.icon}
            label={d.label}
          />
        ))}
      </div>
      <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
      <div className="flex items-center gap-0.5">
        {CAMERA.map((c) => (
          <Chip
            key={c.mode}
            active={controls.cameraMode === c.mode}
            onClick={() => onChange({ cameraMode: c.mode })}
            icon={c.icon}
            label={c.label}
          />
        ))}
      </div>
    </div>
  )
}
