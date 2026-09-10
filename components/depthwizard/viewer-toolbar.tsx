'use client'

import {
  Box,
  Building2,
  Crosshair,
  Grid2x2,
  Image as ImageIcon,
  Layers,
  Mountain,
  Orbit,
  Palette,
  Plane,
  Route,
  Spline,
  Waypoints,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TerrainControls } from './terrain-viewer'

type ToggleKey = keyof Pick<
  TerrainControls,
  'texture' | 'heightColors' | 'dTerrain' | 'smooth' | 'block' | 'buildings' | 'wireframe' | 'grid' | 'probe'
>

const CAMERA: { mode: TerrainControls['cameraMode']; label: string; icon: LucideIcon }[] = [
  { mode: 'orbit', label: 'Orbit', icon: Orbit },
  { mode: 'fly', label: 'Fly', icon: Route },
  { mode: 'tour', label: 'Tour', icon: Waypoints },
]

const DISPLAY: { key: ToggleKey; label: string; icon: LucideIcon }[] = [
  { key: 'texture', label: 'RGB', icon: ImageIcon },
  { key: 'heightColors', label: 'Height', icon: Palette },
  { key: 'dTerrain', label: 'D-Terrain', icon: Mountain },
  { key: 'smooth', label: 'Smooth', icon: Spline },
  { key: 'block', label: '3D Block', icon: Box },
  { key: 'buildings', label: 'Buildings', icon: Building2 },
  { key: 'wireframe', label: 'Wire', icon: Layers },
]

const TERRAIN: { key: ToggleKey; label: string; icon: LucideIcon }[] = [
  { key: 'grid', label: 'Grid', icon: Grid2x2 },
  { key: 'probe', label: 'Probe', icon: Crosshair },
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
      title={label}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      )}
    >
      <Icon className="size-3.5" strokeWidth={1.75} />
      <span className="hidden lg:inline">{label}</span>
    </button>
  )
}

function Divider() {
  return <span className="mx-0.5 hidden h-5 w-px bg-border sm:block" />
}

export function ViewerToolbar({
  controls,
  onChange,
  onAerialFly,
  className,
}: {
  controls: TerrainControls
  onChange: (patch: Partial<TerrainControls>) => void
  onAerialFly?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-0.5 rounded-lg border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur',
        className,
      )}
    >
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
        <Chip active={false} onClick={() => onAerialFly?.()} icon={Plane} label="Aerial" />
      </div>

      <Divider />

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

      <Divider />

      <div className="flex items-center gap-0.5">
        {TERRAIN.map((d) => (
          <Chip
            key={d.key}
            active={controls[d.key]}
            onClick={() => onChange({ [d.key]: !controls[d.key] })}
            icon={d.icon}
            label={d.label}
          />
        ))}
      </div>
    </div>
  )
}
