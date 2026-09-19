import Link from 'next/link'
import { ArrowRight, ScanLine } from 'lucide-react'
import { SiteHeader } from '@/components/depthwizard/site-header'
import { TerrainViewer, DEFAULT_CONTROLS, type TerrainControls } from '@/components/depthwizard/terrain-viewer'

const HERO_CONTROLS: TerrainControls = { ...DEFAULT_CONTROLS, grid: false, cameraMode: 'tour', autoRotate: true }

const PIPELINE = [
  ['01', 'IMAGE', 'BEGIN WITH ONE OPTICAL IMAGE.', 'A single source becomes the beginning of a spatial record.'],
  ['02', 'DEPTH', 'REVEAL HIDDEN GEOMETRY.', 'Estimate the spatial structure held inside every pixel.'],
  ['03', 'CALIBRATION', 'GIVE THE SCENE SCALE.', 'Reference information turns relative depth into measurable terrain.'],
  ['04', 'TERRAIN', 'RECONSTRUCT THE SURFACE.', 'The depth field becomes a navigable digital elevation model.'],
  ['05', 'STRUCTURES', 'BUILD WHAT STANDS ON IT.', 'Reconstruct buildings and structures over the terrain.'],
  ['06', 'EXPLORE', 'ENTER THE ENVIRONMENT.', 'Inspect, measure, and export the result in real time.'],
]

const TECHNOLOGIES = [
  { name: 'DEPTH ESTIMATION', tech: 'DEPTH ANYTHING V2' },
  { name: 'COMPUTE', tech: 'PYTORCH' },
  { name: 'IMAGE PROCESSING', tech: 'OPENCV' },
  { name: 'RASTER', tech: 'RASTERIO' },
  { name: 'BACKEND', tech: 'FASTAPI' },
  { name: 'VISUALIZATION', tech: 'THREE.JS' },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050606] text-[#f4f2ea] selection:bg-white selection:text-black">
      {/* Subtle technical background grid */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.015]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#35D6FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <SiteHeader />
      <main>
        {/* Hero Section — Editorial Composition */}
        <section id="story" className="relative border-b border-white/10 px-6 py-32 lg:px-12 lg:py-48">
          <div className="mx-auto max-w-[1400px]">
            {/* Small technical label */}
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A8AAA5] mb-16">01 / Optical Imagery → Spatial Understanding</p>

            {/* Massive headline */}
            <div className="mb-20">
              <h1 className="text-[clamp(5rem,12vw,11rem)] font-bold leading-[0.88] tracking-[-0.02em] text-[#F4F2EA]">
                TURN IMAGERY
                <br />
                INTO A 3D WORLD
              </h1>
            </div>

            {/* Descriptive text */}
            <div className="mb-16 max-w-2xl">
              <p className="text-sm leading-7 text-[#A8AAA5]">
                Extract spatial information from optical imagery. Estimate depth. Reconstruct terrain. Explore in 3D.
              </p>
            </div>

            {/* CTA + Technical metadata */}
            <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-3 rounded-sm border border-white/30 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-[#F4F2EA] transition-all hover:border-[#35D6FF] hover:text-[#35D6FF]"
              >
                Start analysis <ArrowRight className="size-4" />
              </Link>

              {/* Technical system labels */}
              <div className="space-y-2 text-[9px] uppercase tracking-[0.2em] text-[#A8AAA5]">
                <div>System / Ready</div>
                <div>Model / Depth Estimation</div>
                <div>Output / 3D Terrain</div>
              </div>
            </div>
          </div>
        </section>

        {/* Terrain Visualization Section */}
        <section id="terrain" className="relative border-b border-white/10 px-6 py-24 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#A8AAA5] mb-6">02 / Terrain Reconstruction</p>
                <h2 className="text-[clamp(3.5rem,8vw,5rem)] font-bold leading-[0.9] tracking-[-0.01em] text-[#F4F2EA]">
                  SEE THE SURFACE
                  <br />
                  BEHIND THE IMAGE
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-sm leading-6 text-[#A8AAA5]">
                  Interactive 3D reconstruction powered by the DepthWizard terrain engine. Rotate, zoom, and inspect spatial relationships.
                </p>
                <div className="space-y-2 text-[9px] uppercase tracking-[0.2em] text-[#39E6C1]">
                  <div>Elevation Field / Live</div>
                  <div>Depth Surface / Calibrated</div>
                  <div>Structures / Reconstructed</div>
                </div>
              </div>
            </div>

            {/* 3D Terrain Viewer */}
            <div className="relative h-[520px] overflow-hidden border border-white/10 bg-[#0B0F10] sm:h-[680px] rounded-sm">
              <TerrainViewer theme="dark" controls={HERO_CONTROLS} className="absolute inset-0" />
              <div className="pointer-events-none absolute inset-5 flex flex-col justify-between text-[9px] uppercase tracking-[0.18em] text-[#A8AAA5]">
                <div className="flex items-center gap-2">
                  <ScanLine className="size-3" /> Interactive Surface / Live View
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 font-mono">
                  <span>Depth / Elevation / Structures</span>
                  <span className="text-[#35D6FF]">DSM 04.82</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline Section */}
        <section id="workflow" className="relative border-b border-white/10 px-6 py-24 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#A8AAA5] mb-6">03 / Processing Pipeline</p>
              <h2 className="text-[clamp(3.5rem,8vw,5rem)] font-bold leading-[0.9] tracking-[-0.01em] text-[#F4F2EA]">
                FROM PIXELS
                <br />
                TO SPATIAL UNDERSTANDING
              </h2>
            </div>

            {/* Pipeline grid */}
            <div className="grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {PIPELINE.map(([index, label, title, body]) => (
                <article
                  key={index}
                  className="min-h-72 border-b border-r border-white/10 p-7 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex justify-between items-start mb-12">
                    <div className="text-3xl font-bold text-[#35D6FF]/20">{index}</div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#39E6C1]">{label}</span>
                  </div>
                  <h3 className="text-lg font-semibold leading-tight text-[#F4F2EA] mb-3">{title}</h3>
                  <p className="text-sm leading-6 text-[#A8AAA5]">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section id="technology" className="relative border-b border-white/10 px-6 py-24 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#A8AAA5] mb-6">04 / Technology Stack</p>
              <h2 className="text-[clamp(3.5rem,8vw,5rem)] font-bold leading-[0.9] tracking-[-0.01em] text-[#F4F2EA]">
                BUILT FOR
                <br />
                GEOSPATIAL INTELLIGENCE
              </h2>
            </div>

            {/* Tech grid */}
            <div className="grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3 gap-0">
              {TECHNOLOGIES.map((tech) => (
                <div key={tech.tech} className="border-b border-r border-white/10 p-7 hover:bg-white/[0.02] transition-colors">
                  <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#A8AAA5] mb-2">{tech.name}</div>
                  <div className="text-sm font-semibold text-[#35D6FF]">{tech.tech}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative border-t border-white/10 px-6 py-32 lg:px-12 lg:py-48">
          <div className="mx-auto max-w-[1400px] text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#A8AAA5] mb-12">Ready to explore</p>
            <h2 className="text-[clamp(4rem,10vw,6.5rem)] font-bold leading-[0.88] tracking-[-0.02em] text-[#F4F2EA] mb-8">
              YOUR WORLD
              <br />
              IN 3D
            </h2>
            <p className="mx-auto mb-12 max-w-md text-sm leading-6 text-[#A8AAA5]">
              Upload an image and start reconstructing spatial structure.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-3 rounded-sm border border-white/30 px-7 py-3 text-[11px] uppercase tracking-[0.18em] text-[#F4F2EA] transition-all hover:border-[#35D6FF] hover:text-[#35D6FF]"
            >
              Launch workspace <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 text-[9px] uppercase tracking-[0.18em] text-[#A8AAA5] sm:flex-row sm:items-center">
          <span>DepthWizard</span>
          <div className="flex gap-6 text-[9px]">
            <a href="#terrain" className="transition-colors hover:text-[#35D6FF]">Terrain</a>
            <a href="#workflow" className="transition-colors hover:text-[#35D6FF]">Pipeline</a>
            <a href="#technology" className="transition-colors hover:text-[#35D6FF]">Technology</a>
          </div>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  )
}
