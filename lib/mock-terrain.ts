// Procedural mock terrain for the DepthWizard 3D viewer.
//
// The depth model is not yet connected, so this module synthesizes a realistic
// satellite-derived heightfield from layered value noise (broad hills, ridges,
// a gentle central valley). Everything here is framework-free so it can be
// reused by the viewer, exports, or a future API client. When real depth data
// arrives, replace `heightNorm` (and `generateTerrain`) with the backend field
// and the rest of the pipeline keeps working unchanged.

export const TERRAIN_SIZE = 10 // world units across the terrain
export const MAX_HEIGHT = 1.7 // world units for full 0..1 relief (before relief mult)
export const METRIC_RANGE = 140 // meters mapped across the full relative depth range

// ---- deterministic value noise ---------------------------------------------

function hash(x: number, z: number, seed: number): number {
  let n = Math.imul(x | 0, 374761393) + Math.imul(z | 0, 668265263) + Math.imul(seed | 0, 362437)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t)
}

function valueNoise(x: number, z: number, seed: number): number {
  const x0 = Math.floor(x)
  const z0 = Math.floor(z)
  const fx = x - x0
  const fz = z - z0
  const v00 = hash(x0, z0, seed)
  const v10 = hash(x0 + 1, z0, seed)
  const v01 = hash(x0, z0 + 1, seed)
  const v11 = hash(x0 + 1, z0 + 1, seed)
  const sx = smooth(fx)
  const sz = smooth(fz)
  const a = v00 + (v10 - v00) * sx
  const b = v01 + (v11 - v01) * sx
  return a + (b - a) * sz
}

function fbm(x: number, z: number): number {
  let sum = 0
  let amp = 0.5
  let freq = 1
  let norm = 0
  for (let o = 0; o < 5; o++) {
    sum += valueNoise(x * freq, z * freq, o * 17 + 3) * amp
    norm += amp
    freq *= 2
    amp *= 0.5
  }
  return sum / norm
}

// Raw, un-normalized terrain field over normalized coords u,v in [0,1].
function rawHeight(u: number, v: number): number {
  const x = u * 4.2
  const z = v * 4.2
  // rolling hills
  const hills = fbm(x, z)
  // sharp-ish mountain ridges via inverted absolute noise
  const r = valueNoise(x * 0.85 + 11.3, z * 0.85 + 7.1, 5)
  const ridge = 1 - Math.abs(2 * r - 1)
  // broad central valley / basin so the surface reads as a real site
  const basin = Math.sin(u * Math.PI) * Math.sin(v * Math.PI)
  return hills * 0.62 + ridge * ridge * 0.28 + basin * 0.24
}

// Precompute global min/max so the field normalizes cleanly to 0..1.
const _range = (() => {
  let min = Infinity
  let max = -Infinity
  const N = 96
  for (let iy = 0; iy < N; iy++) {
    for (let ix = 0; ix < N; ix++) {
      const h = rawHeight(ix / (N - 1), iy / (N - 1))
      if (h < min) min = h
      if (h > max) max = h
    }
  }
  return { min, max, span: max - min || 1 }
})()

/** Normalized elevation 0..1 from normalized coords u,v in [0,1]. */
export function heightNormUV(u: number, v: number): number {
  const cu = u < 0 ? 0 : u > 1 ? 1 : u
  const cv = v < 0 ? 0 : v > 1 ? 1 : v
  return (rawHeight(cu, cv) - _range.min) / _range.span
}

function worldToUV(x: number, z: number): [number, number] {
  return [(x + TERRAIN_SIZE / 2) / TERRAIN_SIZE, (z + TERRAIN_SIZE / 2) / TERRAIN_SIZE]
}

/** Normalized elevation 0..1 at a world (x,z) position. */
export function getElevationNorm(x: number, z: number): number {
  const [u, v] = worldToUV(x, z)
  return heightNormUV(u, v)
}

/** World-space Y (before relief multiplier) at a world (x,z) position. */
export function getElevation(x: number, z: number): number {
  return getElevationNorm(x, z) * MAX_HEIGHT
}

/** Approximate slope in degrees from neighboring height samples. */
export function getSlope(x: number, z: number): number {
  const e = 0.12
  const dydx = (getElevation(x + e, z) - getElevation(x - e, z)) / (2 * e)
  const dydz = (getElevation(x, z + e) - getElevation(x, z - e)) / (2 * e)
  const grad = Math.hypot(dydx, dydz)
  return (Math.atan(grad) * 180) / Math.PI
}

export interface TerrainField {
  size: number
  res: number
  heights: Float32Array // normalized 0..1, row-major (z * res + x)
}

/** Sample the field into a res×res normalized grid (row-major). */
export function generateTerrain(res = 160): TerrainField {
  const heights = new Float32Array(res * res)
  for (let iz = 0; iz < res; iz++) {
    for (let ix = 0; ix < res; ix++) {
      heights[iz * res + ix] = heightNormUV(ix / (res - 1), iz / (res - 1))
    }
  }
  return { size: TERRAIN_SIZE, res, heights }
}

export interface BuildingSpec {
  x: number // world x (center)
  z: number // world z (center)
  w: number // footprint width
  d: number // footprint depth
  h: number // building height (world units, before relief)
  base: number // terrain elevation at base (world Y, before relief)
  rot: number // yaw rotation
}

/**
 * ~22 site-analysis building masses placed in a developed cluster. Each base
 * follows the terrain elevation so nothing floats.
 */
export function getBuildingData(): BuildingSpec[] {
  const out: BuildingSpec[] = []
  let seed = 1337
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  // developed quarter of the site
  for (let gx = 0; gx < 6; gx++) {
    for (let gz = 0; gz < 5; gz++) {
      if (rand() > 0.78) continue
      const u = 0.5 + gx * 0.062 + (rand() - 0.5) * 0.02
      const v = 0.28 + gz * 0.062 + (rand() - 0.5) * 0.02
      const x = (u - 0.5) * TERRAIN_SIZE
      const z = (v - 0.5) * TERRAIN_SIZE
      out.push({
        x,
        z,
        w: 0.24 + rand() * 0.34,
        d: 0.24 + rand() * 0.34,
        h: 0.14 + rand() * 0.46,
        base: getElevation(x, z),
        rot: (rand() - 0.5) * 0.5,
      })
    }
  }
  return out
}
