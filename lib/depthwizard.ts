// Shared domain types and mock data for the DepthWizard frontend.
// Keep this free of React so it can be reused by API routes and components.

export type InferenceQuality = 'fast' | 'quality'

export interface SceneMeta {
  filename: string
  width: number
  height: number
  format: string
  bands: string
  processingTime: string
  compute: string
  outputBasis: string
  outputBasisDetail: string
  crs: string
  bounds: string
  inference: string
  calibration: string
}

export interface PipelineStep {
  id: string
  index: string
  label: string
  description: string
}

export interface Artifact {
  id: string
  name: string
  format: string
  description: string
  size: string
}

export interface TechnicalNote {
  id: string
  label: string
  body: string
}

export const SCENE: SceneMeta = {
  filename: 'rgb_2021.tif',
  width: 1024,
  height: 1024,
  format: 'GeoTIFF',
  bands: 'RGB',
  processingTime: '179.1 s',
  compute: 'CPU',
  outputBasis: 'RGB-only',
  outputBasisDetail: 'Relative / scale-ambiguous',
  crs: 'EPSG:26985',
  bounds: '[ 398250.0, 4306500.0 → 399274.0, 4307524.0 ]',
  inference: 'Quality / 2 model passes',
  calibration: 'RELATIVE',
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'decode',
    index: '01',
    label: 'Decode raster',
    description: 'Read GeoTIFF bands and spatial reference.',
  },
  {
    id: 'depth',
    index: '02',
    label: 'Estimate relative depth',
    description: 'Run monocular depth inference on the RGB raster.',
  },
  {
    id: 'calibrate',
    index: '03',
    label: 'Calibrate height',
    description: 'Resolve relative depth toward a height field.',
  },
  {
    id: 'evaluate',
    index: '04',
    label: 'Evaluate scene',
    description: 'Assess structure, slope and coverage.',
  },
  {
    id: 'terrain',
    index: '05',
    label: 'Build terrain',
    description: 'Assemble the displaced heightfield surface.',
  },
  {
    id: 'scene',
    index: '06',
    label: 'Generate 3D scene',
    description: 'Texture the surface and place structures.',
  },
]

export const ARTIFACTS: Artifact[] = [
  {
    id: 'original-png',
    name: 'Original PNG',
    format: 'PNG',
    description: 'Source RGB satellite raster, 1024 × 1024.',
    size: '2.1 MB',
  },
  {
    id: 'depth-png',
    name: 'Depth PNG',
    format: 'PNG',
    description: 'Predicted relative depth, visualized.',
    size: '0.6 MB',
  },
  {
    id: 'depth-npy',
    name: 'Depth NPY',
    format: 'NPY',
    description: 'Raw relative depth array, float32.',
    size: '4.0 MB',
  },
  {
    id: 'texture-png',
    name: 'Terrain Texture PNG',
    format: 'PNG',
    description: 'Resampled surface texture for the mesh.',
    size: '2.4 MB',
  },
  {
    id: 'normal-png',
    name: 'Normal Map PNG',
    format: 'PNG',
    description: 'Tangent-space normals derived from depth.',
    size: '1.8 MB',
  },
  {
    id: 'dsm-tif',
    name: 'Calibrated DSM GeoTIFF',
    format: 'GeoTIFF',
    description: 'Digital surface model, relative basis.',
    size: '5.3 MB',
  },
  {
    id: 'scene-glb',
    name: '3D Scene GLB',
    format: 'GLB',
    description: 'Textured terrain mesh with structures.',
    size: '8.7 MB',
  },
]

export const TECHNICAL_NOTES: TechnicalNote[] = [
  {
    id: 'depth-inference',
    label: 'Depth inference',
    body: 'Model inference bounded to 1022 × 1022 and resampled to 1024 × 1024.',
  },
  {
    id: 'calibration',
    label: 'Calibration',
    body: 'Shadow-based metric calibration was not applied because acquisition timestamp was unavailable.',
  },
  {
    id: 'surface',
    label: 'Surface',
    body: '3D surface generated from the source image and predicted depth.',
  },
  {
    id: 'structures',
    label: 'Structures',
    body: 'Detected structures are represented as display geometry over the terrain surface.',
  },
]

export const SPATIAL_CONTEXT: { label: string; value: string }[] = [
  { label: 'Dimensions', value: '1024 × 1024' },
  { label: 'CRS', value: 'EPSG:26985' },
  { label: 'Bounds', value: '398250, 4306500 → 399274, 4307524' },
  { label: 'Output basis', value: 'Relative depth' },
  { label: 'Inference', value: 'Quality / 2 model passes' },
]

export const ANALYSIS_DETAILS: { label: string; value: string }[] = [
  { label: 'Raster', value: '1024 × 1024' },
  { label: 'CRS', value: 'EPSG:26985' },
  { label: 'Output basis', value: 'Relative depth' },
  { label: 'Inference', value: '2 model passes' },
  { label: 'Calibration', value: 'Relative' },
  { label: 'Processing', value: '179.1 s' },
]
