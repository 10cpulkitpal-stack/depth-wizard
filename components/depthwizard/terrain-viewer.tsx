'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Grid, OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// drei's OrbitControls ref type — exposes the target vector we nudge in fly mode.
type OrbitControlsImpl = React.ComponentRef<typeof OrbitControls>

export interface TerrainControls {
  texture: boolean
  heightColors: boolean
  smooth: boolean
  block: boolean
  buildings: boolean
  wireframe: boolean
  grid: boolean
  relief: number
  cameraMode: 'orbit' | 'fly' | 'tour'
}

export interface ProbeReading {
  x: number
  y: number
  elevation: number
  slope: number
}

export const DEFAULT_CONTROLS: TerrainControls = {
  texture: true,
  heightColors: false,
  smooth: true,
  block: false,
  buildings: true,
  wireframe: false,
  grid: true,
  relief: 1.5,
  cameraMode: 'orbit',
}

const TERRAIN_SIZE = 10
const SEGMENTS = 200
const MAX_HEIGHT = 1.7
const METRIC_RANGE = 140 // meters mapped across full relative depth range

// ---- height ramp for the "Height Colors" mode -------------------------------
const RAMP: [number, THREE.Color][] = [
  [0.0, new THREE.Color('#3a5a6b')],
  [0.32, new THREE.Color('#5c7360')],
  [0.55, new THREE.Color('#8a8a5c')],
  [0.78, new THREE.Color('#bcab84')],
  [1.0, new THREE.Color('#e9e5db')],
]

function rampColor(t: number, out: THREE.Color) {
  for (let i = 0; i < RAMP.length - 1; i++) {
    const [a, ca] = RAMP[i]
    const [b, cb] = RAMP[i + 1]
    if (t <= b) {
      const k = (t - a) / (b - a || 1)
      return out.copy(ca).lerp(cb, Math.max(0, Math.min(1, k)))
    }
  }
  return out.copy(RAMP[RAMP.length - 1][1])
}

// ---- heightfield sampled from the depth image -------------------------------
function useHeightfield(url: string, seg: number) {
  const [heights, setHeights] = useState<Float32Array | null>(null)
  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = seg
      canvas.height = seg
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(img, 0, 0, seg, seg)
      const { data } = ctx.getImageData(0, 0, seg, seg)
      const h = new Float32Array(seg * seg)
      for (let i = 0; i < seg * seg; i++) h[i] = data[i * 4] / 255
      // light smoothing pass for a cleaner architectural surface
      const s = new Float32Array(h)
      for (let y = 1; y < seg - 1; y++) {
        for (let x = 1; x < seg - 1; x++) {
          const idx = y * seg + x
          s[idx] =
            (h[idx] * 4 +
              h[idx - 1] +
              h[idx + 1] +
              h[idx - seg] +
              h[idx + seg]) /
            8
        }
      }
      if (!cancelled) setHeights(s)
    }
    img.src = url
    return () => {
      cancelled = true
    }
  }, [url, seg])
  return heights
}

function sampleHeight(heights: Float32Array, seg: number, nx: number, nz: number) {
  const x = Math.max(0, Math.min(seg - 1, Math.round(nx * (seg - 1))))
  const z = Math.max(0, Math.min(seg - 1, Math.round(nz * (seg - 1))))
  return heights[z * seg + x]
}

// ---- terrain surface --------------------------------------------------------
function TerrainSurface({
  heights,
  controls,
  textureUrl,
  onProbe,
  setProbeMarker,
}: {
  heights: Float32Array
  controls: TerrainControls
  textureUrl: string
  onProbe?: (r: ProbeReading) => void
  setProbeMarker: (p: THREE.Vector3 | null) => void
}) {
  const texture = useTexture(textureUrl)
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.needsUpdate = true
  }, [texture])

  const geometry = useMemo(() => {
    const seg = Math.sqrt(heights.length)
    const g = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, seg - 1, seg - 1)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const t = heights[i]
      pos.setY(i, t * MAX_HEIGHT)
      rampColor(t, c)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.computeVertexNormals()
    return g
  }, [heights])

  const handleProbe = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const p = e.point
    const nx = (p.x + TERRAIN_SIZE / 2) / TERRAIN_SIZE
    const nz = (p.z + TERRAIN_SIZE / 2) / TERRAIN_SIZE
    const normalized = MAX_HEIGHT * controls.relief
      ? p.y / (MAX_HEIGHT * controls.relief)
      : 0
    let slope = 0
    if (e.face) {
      const n = e.face.normal.clone()
      n.y /= controls.relief || 1
      n.normalize()
      slope = THREE.MathUtils.radToDeg(Math.acos(Math.max(-1, Math.min(1, n.y))))
    }
    setProbeMarker(p.clone())
    onProbe?.({
      x: Number((nx * 1024).toFixed(1)),
      y: Number((nz * 1024).toFixed(1)),
      elevation: Number((Math.max(0, normalized) * METRIC_RANGE).toFixed(1)),
      slope: Number(slope.toFixed(1)),
    })
  }

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      scale-y={controls.relief}
      onPointerDown={handleProbe}
    >
      <meshStandardMaterial
        map={controls.texture && !controls.heightColors ? texture : null}
        vertexColors={controls.heightColors}
        color={controls.heightColors ? '#ffffff' : controls.texture ? '#ffffff' : '#cfd0c8'}
        roughness={0.92}
        metalness={0}
        flatShading={!controls.smooth}
        wireframe={controls.wireframe}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ---- solid block skirt for "3D Block" mode ----------------------------------
function TerrainBlock({ relief }: { relief: number }) {
  return (
    <mesh position={[0, -0.9 * relief, 0]}>
      <boxGeometry args={[TERRAIN_SIZE, 1.8 * relief, TERRAIN_SIZE]} />
      <meshStandardMaterial color="#e7e6e0" roughness={1} metalness={0} />
    </mesh>
  )
}

// ---- building volumes -------------------------------------------------------
function Buildings({
  heights,
  relief,
}: {
  heights: Float32Array
  relief: number
}) {
  const seg = Math.sqrt(heights.length)
  const specs = useMemo(() => {
    const out: { x: number; z: number; w: number; d: number; h: number }[] = []
    let seed = 7
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    for (let gx = 0; gx < 5; gx++) {
      for (let gz = 0; gz < 5; gz++) {
        if (rand() > 0.72) continue
        const nx = 0.36 + gx * 0.065 + (rand() - 0.5) * 0.02
        const nz = 0.36 + gz * 0.065 + (rand() - 0.5) * 0.02
        out.push({
          x: (nx - 0.5) * TERRAIN_SIZE,
          z: (nz - 0.5) * TERRAIN_SIZE,
          w: 0.22 + rand() * 0.16,
          d: 0.22 + rand() * 0.16,
          h: 0.18 + rand() * 0.5,
        })
      }
    }
    return out.map((b) => {
      const nx = b.x / TERRAIN_SIZE + 0.5
      const nz = b.z / TERRAIN_SIZE + 0.5
      const base = sampleHeight(heights, seg, nx, nz) * MAX_HEIGHT
      return { ...b, base }
    })
  }, [heights, seg])

  return (
    <group>
      {specs.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, b.base * relief + (b.h / 2) * relief, b.z]}
          scale-y={relief}
        >
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color="#f4f3ef" roughness={0.7} metalness={0} />
        </mesh>
      ))}
    </group>
  )
}

function ProbeMarker({ point }: { point: THREE.Vector3 | null }) {
  if (!point) return null
  return (
    <group position={point}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.09, 0.13, 32]} />
        <meshBasicMaterial color="#b4453a" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 1, 8]} />
        <meshBasicMaterial color="#b4453a" />
      </mesh>
    </group>
  )
}

// ---- camera behaviour -------------------------------------------------------
function CameraRig({
  mode,
  controlsRef,
}: {
  mode: TerrainControls['cameraMode']
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}) {
  const { camera } = useThree()
  const keys = useRef<Record<string, boolean>>({})

  useEffect(() => {
    if (mode !== 'fly') return
    const down = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = true)
    const up = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      keys.current = {}
    }
  }, [mode])

  useFrame((_, delta) => {
    if (mode !== 'fly') return
    const controls = controlsRef.current
    if (!controls) return
    const speed = delta * 6
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize()
    const move = new THREE.Vector3()
    if (keys.current['w']) move.add(forward)
    if (keys.current['s']) move.sub(forward)
    if (keys.current['d']) move.add(right)
    if (keys.current['a']) move.sub(right)
    if (keys.current['q']) move.y -= 1
    if (keys.current['e']) move.y += 1
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed)
      camera.position.add(move)
      controls.target.add(move)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      autoRotate={mode === 'tour'}
      autoRotateSpeed={0.55}
      minDistance={3.5}
      maxDistance={26}
      maxPolarAngle={Math.PI / 2.05}
      makeDefault
    />
  )
}

function SceneContents({
  controls,
  onProbe,
  depthUrl,
  textureUrl,
}: {
  controls: TerrainControls
  onProbe?: (r: ProbeReading) => void
  depthUrl: string
  textureUrl: string
}) {
  const heights = useHeightfield(depthUrl, SEGMENTS)
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const [probeMarker, setProbeMarker] = useState<THREE.Vector3 | null>(null)

  return (
    <>
      <color attach="background" args={['#f2f2ef']} />
      <hemisphereLight args={['#ffffff', '#d8d8d0', 1.05]} />
      <directionalLight position={[8, 12, 6]} intensity={1.35} />
      <directionalLight position={[-6, 5, -8]} intensity={0.35} />

      {heights && (
        <Suspense fallback={null}>
          <TerrainSurface
            heights={heights}
            controls={controls}
            textureUrl={textureUrl}
            onProbe={onProbe}
            setProbeMarker={setProbeMarker}
          />
          {controls.block && <TerrainBlock relief={controls.relief} />}
          {controls.buildings && (
            <Buildings heights={heights} relief={controls.relief} />
          )}
          {onProbe && <ProbeMarker point={probeMarker} />}
        </Suspense>
      )}

      {controls.grid && (
        <Grid
          args={[TERRAIN_SIZE * 2, TERRAIN_SIZE * 2]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#d3d3cc"
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor="#b7b7ad"
          fadeDistance={34}
          fadeStrength={1.2}
          position={[0, -0.02, 0]}
          infiniteGrid
        />
      )}

      <CameraRig mode={controls.cameraMode} controlsRef={controlsRef} />
    </>
  )
}

export function TerrainViewer({
  controls = DEFAULT_CONTROLS,
  onProbe,
  className,
  depthUrl = '/textures/depth.png',
  textureUrl = '/textures/satellite.png',
  interactive = true,
}: {
  controls?: TerrainControls
  onProbe?: (r: ProbeReading) => void
  className?: string
  depthUrl?: string
  textureUrl?: string
  interactive?: boolean
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', background: '#f2f2ef' }}
      />
    )
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [7.5, 6.5, 9], fov: 42 }}
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <SceneContents
          controls={controls}
          onProbe={onProbe}
          depthUrl={depthUrl}
          textureUrl={textureUrl}
        />
      </Canvas>
    </div>
  )
}
