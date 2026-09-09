'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Grid, OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import {
  TERRAIN_SIZE,
  MAX_HEIGHT,
  METRIC_RANGE,
  generateTerrain,
  getBuildingData,
  getElevation,
  getElevationNorm,
  getSlope,
} from '@/lib/mock-terrain'

// drei's OrbitControls ref type — exposes the target vector we nudge in fly mode.
type OrbitControlsImpl = React.ComponentRef<typeof OrbitControls>

export type Quality = 'low' | 'medium' | 'high'

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
  // scene settings
  shadows: boolean
  atmosphere: boolean
  autoRotate: boolean
  quality: Quality
  tourPaused: boolean
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
  shadows: true,
  atmosphere: true,
  autoRotate: false,
  quality: 'medium',
  tourPaused: false,
}

const QUALITY_SEGMENTS: Record<Quality, number> = { low: 96, medium: 150, high: 210 }
const OVERVIEW = new THREE.Vector3(7.5, 6.5, 9)
const SCENE_CENTER = new THREE.Vector3(0, 1, 0)

// ---- height ramp for the "Height Colors" mode -------------------------------
const RAMP: [number, THREE.Color][] = [
  [0.0, new THREE.Color('#5c7360')], // low — light green
  [0.4, new THREE.Color('#8a8a5c')], // medium — olive / earth
  [0.72, new THREE.Color('#bcab84')], // high — light brown
  [1.0, new THREE.Color('#e9e5db')], // peaks — neutral
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

// ---- terrain surface --------------------------------------------------------
function TerrainSurface({
  segments,
  controls,
  textureUrl,
  onProbe,
  setProbeMarker,
}: {
  segments: number
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
    const field = generateTerrain(segments)
    const seg = field.res
    const g = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, seg - 1, seg - 1)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const t = getElevationNorm(x, z)
      pos.setY(i, t * MAX_HEIGHT)
      rampColor(t, c)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.computeVertexNormals()
    return g
  }, [segments])

  const handleProbe = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const p = e.point
    const norm = getElevationNorm(p.x, p.z)
    const slope = getSlope(p.x, p.z)
    setProbeMarker(new THREE.Vector3(p.x, getElevation(p.x, p.z) * controls.relief, p.z))
    onProbe?.({
      x: Number((((p.x + TERRAIN_SIZE / 2) / TERRAIN_SIZE) * 1024).toFixed(1)),
      y: Number((((p.z + TERRAIN_SIZE / 2) / TERRAIN_SIZE) * 1024).toFixed(1)),
      elevation: Number((norm * METRIC_RANGE).toFixed(1)),
      slope: Number(slope.toFixed(1)),
    })
  }

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      scale-y={controls.relief}
      onPointerDown={handleProbe}
      receiveShadow={controls.shadows}
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

// ---- subtle wireframe overlay on top of the textured surface ----------------
function WireOverlay({ segments, relief }: { segments: number; relief: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, segments - 1, segments - 1)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, getElevation(pos.getX(i), pos.getZ(i)) + 0.01)
    }
    return g
  }, [segments])
  return (
    <mesh geometry={geometry} scale-y={relief}>
      <meshBasicMaterial color="#3f5a45" wireframe transparent opacity={0.14} />
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
function Buildings({ relief, shadows }: { relief: number; shadows: boolean }) {
  const specs = useMemo(() => getBuildingData(), [])
  return (
    <group>
      {specs.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, b.base * relief + (b.h / 2) * relief, b.z]}
          rotation={[0, b.rot, 0]}
          scale-y={relief}
          castShadow={shadows}
          receiveShadow={shadows}
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

// ---- cinematic tour keyframes ----------------------------------------------
const TOUR_KEYS: THREE.Vector3[] = [
  new THREE.Vector3(0, 12, 0.2), // above the terrain
  new THREE.Vector3(0, 6, 9), // move toward it
  new THREE.Vector3(8, 4.5, 4), // fly across
  new THREE.Vector3(6, 5.5, -6), // orbit an elevated section
  new THREE.Vector3(-7, 5, -5), // toward the opposite side
  new THREE.Vector3(-6, 6, 7), // sweep back
  OVERVIEW.clone(), // return to overview
]
const TOUR_DURATION = 26 // seconds

function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

function TourController({
  paused,
  controlsRef,
}: {
  paused: boolean
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}) {
  const { camera } = useThree()
  const elapsed = useRef(0)

  useEffect(() => {
    elapsed.current = 0
  }, [])

  useFrame((_, delta) => {
    if (!paused) elapsed.current += delta
    const segCount = TOUR_KEYS.length - 1
    const loop = (elapsed.current % TOUR_DURATION) / TOUR_DURATION // 0..1
    const scaled = loop * segCount
    const idx = Math.min(segCount - 1, Math.floor(scaled))
    const k = smoothstep(scaled - idx)
    const pos = TOUR_KEYS[idx].clone().lerp(TOUR_KEYS[idx + 1], k)
    camera.position.copy(pos)
    camera.lookAt(SCENE_CENTER)
    const controls = controlsRef.current
    if (controls) controls.target.copy(SCENE_CENTER)
  })

  return null
}

// ---- orbit + fly + reset ----------------------------------------------------
function CameraRig({
  controls,
  controlsRef,
  resetSignal,
}: {
  controls: TerrainControls
  controlsRef: React.RefObject<OrbitControlsImpl | null>
  resetSignal: number
}) {
  const { camera } = useThree()
  const mode = controls.cameraMode
  const keys = useRef<Record<string, boolean>>({})
  const reset = useRef<{ t: number; from: THREE.Vector3; fromTarget: THREE.Vector3 } | null>(null)

  // fly-mode keyboard capture
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

  // kick off a smooth camera reset when the signal changes
  useEffect(() => {
    if (resetSignal === 0) return
    const ctrl = controlsRef.current
    reset.current = {
      t: 0,
      from: camera.position.clone(),
      fromTarget: ctrl ? ctrl.target.clone() : new THREE.Vector3(),
    }
  }, [resetSignal, camera, controlsRef])

  useFrame((_, delta) => {
    const controlsImpl = controlsRef.current

    // animate reset (works regardless of mode)
    if (reset.current && controlsImpl) {
      reset.current.t = Math.min(1, reset.current.t + delta * 1.4)
      const k = smoothstep(reset.current.t)
      camera.position.copy(reset.current.from).lerp(OVERVIEW, k)
      controlsImpl.target.copy(reset.current.fromTarget).lerp(SCENE_CENTER, k)
      if (reset.current.t >= 1) reset.current = null
      return
    }

    if (mode !== 'fly' || !controlsImpl) return
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
      controlsImpl.target.add(move)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={mode !== 'tour'}
      enableDamping
      dampingFactor={0.08}
      autoRotate={mode === 'orbit' && controls.autoRotate}
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
  textureUrl,
  resetSignal,
}: {
  controls: TerrainControls
  onProbe?: (r: ProbeReading) => void
  textureUrl: string
  resetSignal: number
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const [probeMarker, setProbeMarker] = useState<THREE.Vector3 | null>(null)
  const segments = QUALITY_SEGMENTS[controls.quality]

  return (
    <>
      <color attach="background" args={['#f2f2ef']} />
      {controls.atmosphere && <fog attach="fog" args={['#ececea', 24, 60]} />}
      <hemisphereLight args={['#ffffff', '#d8d8d0', 1.0]} />
      <directionalLight
        position={[8, 13, 6]}
        intensity={1.35}
        castShadow={controls.shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 5, -8]} intensity={0.35} />

      <Suspense fallback={null}>
        <TerrainSurface
          segments={segments}
          controls={controls}
          textureUrl={textureUrl}
          onProbe={onProbe}
          setProbeMarker={setProbeMarker}
        />
        {controls.wireframe && !controls.heightColors && (
          <WireOverlay segments={segments} relief={controls.relief} />
        )}
        {controls.block && <TerrainBlock relief={controls.relief} />}
        {controls.buildings && <Buildings relief={controls.relief} shadows={controls.shadows} />}
        {onProbe && <ProbeMarker point={probeMarker} />}
      </Suspense>

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

      <CameraRig controls={controls} controlsRef={controlsRef} resetSignal={resetSignal} />
      {controls.cameraMode === 'tour' && (
        <TourController paused={controls.tourPaused} controlsRef={controlsRef} />
      )}
    </>
  )
}

export function TerrainViewer({
  controls = DEFAULT_CONTROLS,
  onProbe,
  className,
  textureUrl = '/textures/satellite.png',
  interactive = true,
  resetSignal = 0,
}: {
  controls?: TerrainControls
  onProbe?: (r: ProbeReading) => void
  className?: string
  textureUrl?: string
  interactive?: boolean
  resetSignal?: number
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
        shadows
        dpr={[1, 2]}
        camera={{ position: [OVERVIEW.x, OVERVIEW.y, OVERVIEW.z], fov: 42 }}
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <SceneContents
          controls={controls}
          onProbe={onProbe}
          textureUrl={textureUrl}
          resetSignal={resetSignal}
        />
      </Canvas>
    </div>
  )
}
