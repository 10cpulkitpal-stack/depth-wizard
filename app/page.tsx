import Link from 'next/link'
import { ArrowDownRight, ArrowRight, Play, ScanLine } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SiteHeader } from '@/components/depthwizard/site-header'
import { TerrainViewer, DEFAULT_CONTROLS, type TerrainControls } from '@/components/depthwizard/terrain-viewer'

const HERO_CONTROLS: TerrainControls = { ...DEFAULT_CONTROLS, grid: false, cameraMode: 'tour', autoRotate: true }

const PIPELINE = [
  ['01', 'IMAGE', 'Begin with one optical image.', 'A single source becomes the beginning of a spatial record.'],
  ['02', 'DEPTH', 'Reveal hidden geometry.', 'Estimate the spatial structure held inside every pixel.'],
  ['03', 'CALIBRATION', 'Give the scene scale.', 'Reference information turns relative depth into measurable terrain.'],
  ['04', 'TERRAIN', 'Reconstruct the surface.', 'The depth field becomes a navigable digital elevation model.'],
  ['05', 'STRUCTURES', 'Build what stands on it.', 'Reconstruct buildings and structures over the terrain.'],
  ['06', 'EXPLORE', 'Enter the environment.', 'Inspect, measure, and export the result in real time.'],
]

const TECHNOLOGIES = ['PYTORCH', 'OPENCV', 'NUMPY', 'RASTERIO', 'FASTAPI', 'REACT', 'THREE.JS', 'R3F']

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080909] text-[#f1f1ee] selection:bg-white selection:text-black">
      <SiteHeader />
      <main>
        <section className="relative border-b border-white/15 px-6 py-24 sm:py-32 lg:px-12 lg:py-40">
          <div className="mx-auto max-w-[1400px] text-center">
            <p className="mb-8 text-[10px] uppercase tracking-[0.3em] text-white/45">Optical imagery / spatial understanding</p>
            <h1 className="mx-auto max-w-6xl text-balance text-[clamp(3.8rem,10vw,9.5rem)] font-light leading-[0.86] tracking-[-0.08em]">Turn satellite imagery<br /><span className="bg-gradient-to-b from-white via-white/80 to-white/35 bg-clip-text text-transparent">into a 3D world.</span></h1>
            <p className="mx-auto mt-10 max-w-lg text-sm leading-7 text-white/55 sm:text-base">DepthWizard transforms optical satellite imagery into measurable terrain, reconstructed structures, and interactive 3D environments.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/analyze" className={cn(buttonVariants(), 'h-11 rounded-full bg-white px-6 text-[11px] uppercase tracking-[0.16em] text-black hover:bg-white/80')}>Start analysis <ArrowRight data-icon="inline-end" /></Link>
              <a href="#terrain" className="inline-flex h-11 items-center gap-3 rounded-full border border-white/25 px-5 text-[11px] uppercase tracking-[0.16em] text-white/75 transition-colors hover:border-white hover:text-white"><Play className="size-3 fill-current" /> Explore 3D</a>
            </div>
          </div>
          <div className="mx-auto mt-28 grid max-w-[1400px] grid-cols-2 border-y border-white/15 sm:grid-cols-4 lg:grid-cols-8">
            {TECHNOLOGIES.map((tech) => <span key={tech} className="border-r border-white/10 px-3 py-5 text-center text-[10px] tracking-[0.16em] text-white/45 last:border-r-0">{tech}</span>)}
          </div>
        </section>

        <section id="terrain" className="border-b border-white/15 px-6 py-24 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end"><div><p className="text-[10px] uppercase tracking-[0.25em] text-white/45">03 / Terrain reconstruction</p><h2 className="mt-5 max-w-3xl text-5xl font-light leading-[0.92] tracking-[-0.07em] sm:text-7xl">See the surface<br />behind the image.</h2></div><p className="max-w-sm text-sm leading-6 text-white/45">A live reconstruction from the existing DepthWizard terrain engine. Rotate, zoom, and inspect the scene.</p></div>
            <div className="relative h-[520px] overflow-hidden border border-white/15 bg-[#111212] sm:h-[680px]"><TerrainViewer theme="dark" controls={HERO_CONTROLS} className="absolute inset-0" /><div className="pointer-events-none absolute inset-5 flex flex-col justify-between text-[10px] uppercase tracking-[0.18em] text-white/45"><div className="flex items-center gap-2"><ScanLine className="size-3" /> Interactive surface / live view</div><div className="flex justify-between border-t border-white/15 pt-3 font-mono"><span>DEPTH / ELEVATION / STRUCTURES</span><span>DSM 04.82</span></div></div></div>
          </div>
        </section>

        <section id="story" className="border-b border-white/15 px-6 py-24 lg:px-12 lg:py-36"><div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="text-[10px] uppercase tracking-[0.25em] text-white/45">01 / What DepthWizard does</p><h2 className="mt-6 max-w-xl text-5xl font-light leading-[0.92] tracking-[-0.07em] sm:text-8xl">One image.<br />Multiple dimensions.</h2></div><div className="lg:pt-24"><p className="max-w-xl text-xl leading-8 text-white/60 sm:text-2xl">DepthWizard extracts spatial information from optical imagery and reconstructs it into an interactive 3D environment.</p><Link href="/analyze" className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:text-white/60">Enter the workspace <ArrowRight className="size-4" /></Link></div></div></section>

        <section id="workflow" className="border-b border-white/15 px-6 py-24 lg:px-12 lg:py-36"><div className="mx-auto max-w-[1400px]"><div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-[10px] uppercase tracking-[0.25em] text-white/45">02 / The process</p><h2 className="mt-5 text-5xl font-light tracking-[-0.07em] sm:text-7xl">From image to world.</h2></div><p className="max-w-xs text-sm leading-6 text-white/45">Each stage adds a layer of understanding without losing the source.</p></div><div className="grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-3">{PIPELINE.map(([index, label, title, body]) => <article key={index} className="min-h-64 border-b border-r border-white/15 p-6 transition-colors hover:bg-white/[0.04] sm:p-8"><div className="flex justify-between text-[10px] tracking-[0.2em] text-white/45"><span>{index}</span><span>{label}</span></div><h3 className="mt-20 max-w-xs text-xl font-light tracking-[-0.03em]">{title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-white/45">{body}</p></article>)}</div></div></section>

        <section id="technology" className="px-6 py-24 lg:px-12 lg:py-36"><div className="mx-auto max-w-[1400px]"><p className="text-[10px] uppercase tracking-[0.25em] text-white/45">04 / Technology</p><h2 className="mt-5 max-w-3xl text-5xl font-light leading-[0.92] tracking-[-0.07em] sm:text-8xl">Built for<br />spatial understanding.</h2><div className="mt-20 grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">{TECHNOLOGIES.map((tech) => <div key={tech} className="border-b border-r border-white/15 p-7 text-sm tracking-[0.12em] text-white/65">{tech}</div>)}</div></div></section>

        <section className="mx-6 mb-24 border-y border-white/15 py-24 text-center lg:mx-12 lg:py-36"><p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Start with what you have</p><h2 className="mx-auto mt-6 max-w-4xl text-5xl font-light leading-[0.9] tracking-[-0.08em] sm:text-8xl">Ready to see<br />your world in 3D?</h2><p className="mx-auto mt-8 max-w-md text-sm leading-6 text-white/45">Upload an image and start reconstructing.</p><Link href="/analyze" className="mt-9 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-[11px] uppercase tracking-[0.16em] text-black transition-transform hover:translate-x-1">Start analysis <ArrowRight className="size-4" /></Link></section>
      </main>
      <footer className="border-t border-white/15 px-6 py-8 lg:px-12"><div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-white/40 sm:flex-row"><span>DepthWizard</span><span>Product · Technology · Workspace</span><span>© 2026</span></div></footer>
    </div>
  )
}
