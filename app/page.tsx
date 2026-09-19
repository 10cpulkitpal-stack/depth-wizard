import Link from 'next/link'
import { ArrowDownRight, ArrowRight, Play, ScanLine } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SiteHeader } from '@/components/depthwizard/site-header'
import {
  TerrainViewer,
  DEFAULT_CONTROLS,
  type TerrainControls,
} from '@/components/depthwizard/terrain-viewer'

const HERO_CONTROLS: TerrainControls = {
  ...DEFAULT_CONTROLS,
  grid: false,
  cameraMode: 'tour',
  autoRotate: true,
}

const PIPELINE = [
  { index: '01', label: 'IMAGE', title: 'Start with a single optical image.', body: 'One RGB satellite image is enough to begin.' },
  { index: '02', label: 'DEPTH', title: 'Reveal the spatial structure.', body: 'DepthWizard estimates the hidden geometry in every pixel.' },
  { index: '03', label: 'CALIBRATION', title: 'Give the scene meaningful scale.', body: 'Reference information turns relative depth into measurable terrain.' },
  { index: '04', label: 'TERRAIN', title: 'Reconstruct the surface.', body: 'The depth field becomes a navigable digital elevation model.' },
  { index: '05', label: 'STRUCTURES', title: 'Build what stands on it.', body: 'Buildings and structures are reconstructed over the terrain.' },
  { index: '06', label: 'EXPLORE', title: 'Enter the 3D environment.', body: 'Inspect, measure, and export the result in real time.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#101311] text-[#edf0e9] selection:bg-[#9bc89f] selection:text-[#101311]">
      <SiteHeader />
      <main>
        <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_45%,rgba(91,125,94,0.24),transparent_36%),linear-gradient(115deg,#101311_10%,#161d18_100%)]" />
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1400px] items-center gap-10 px-6 py-16 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:py-20">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-10 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#9bc89f]"><span className="size-2 rounded-full bg-[#9bc89f] shadow-[0_0_18px_#9bc89f]" /> Satellite intelligence / 01</div>
              <h1 className="max-w-3xl text-balance text-6xl font-medium leading-[0.92] tracking-[-0.07em] text-[#f4f5ef] sm:text-7xl lg:text-[7.4rem]">Turn one image<br /><span className="text-[#9bc89f]">into a 3D world.</span></h1>
              <p className="mt-8 max-w-md text-base leading-7 text-[#a7b0a7]">DepthWizard transforms optical imagery into measurable terrain, reconstructed structures, and an interactive 3D environment.</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/analyze" className={cn(buttonVariants(), 'h-12 rounded-full bg-[#a4cfa7] px-6 text-[#101311] hover:bg-[#c0e1c2]')}><span>Start analysis</span><ArrowRight data-icon="inline-end" /></Link>
                <Link href="#terrain" className="group flex items-center gap-3 px-2 text-sm text-[#c4ccc3] transition-colors hover:text-white"><span className="flex size-10 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-[#9bc89f]"><Play className="size-3 fill-current" /></span>Explore 3D</Link>
              </div>
              <div className="mt-20 grid max-w-md grid-cols-3 border-t border-white/15 pt-5 text-[10px] uppercase tracking-[0.16em] text-[#778178]"><span>RGB → DEPTH</span><span className="text-center">2.5D / DSM</span><span className="text-right">ISRO · SIH26175</span></div>
            </div>
            <div id="terrain" className="relative h-[480px] overflow-hidden border border-white/10 bg-[#161c18] sm:h-[580px] lg:h-[680px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(143,184,148,0.1),transparent_50%)]" />
              <TerrainViewer theme="dark" controls={HERO_CONTROLS} className="absolute inset-0" />
              <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#9bc89f]"><ScanLine className="size-3" /> Live reconstruction</div>
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex justify-between border-t border-white/15 pt-3 font-mono text-[10px] text-[#758077]"><span>LAT 28.6139° N</span><span>DEPTH FIELD / 04.82</span></div>
            </div>
          </div>
          <a href="#story" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#778178] md:flex">Scroll to descend <ArrowDownRight className="size-3" /></a>
        </section>

        <section id="story" className="mx-auto max-w-[1400px] px-6 py-28 lg:px-12 lg:py-40">
          <div className="grid gap-14 lg:grid-cols-[0.48fr_1fr]">
            <div><p className="text-[10px] uppercase tracking-[0.22em] text-[#9bc89f]">From image to space</p><h2 className="mt-5 max-w-sm text-4xl font-medium leading-tight tracking-[-0.05em] sm:text-5xl">A new dimension for every frame.</h2></div>
            <div className="max-w-2xl lg:pt-10"><p className="text-xl leading-9 text-[#a7b0a7] sm:text-2xl">A satellite image is a starting point, not the final view. DepthWizard translates visual information into spatial information — then gives you the tools to understand what changed.</p><Link href="/analyze" className="mt-8 inline-flex items-center gap-2 text-sm text-[#c4d9c5] hover:text-white">Enter the workspace <ArrowRight className="size-4" /></Link></div>
          </div>
        </section>

        <section id="workflow" className="border-y border-white/10 bg-[#151a17]">
          <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32"><div className="mb-16 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[10px] uppercase tracking-[0.22em] text-[#9bc89f]">The reconstruction pipeline</p><h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] sm:text-6xl">Six steps to a world.</h2></div><p className="max-w-xs text-sm leading-6 text-[#7f8a81]">Each stage preserves the story of the source image while adding another layer of spatial understanding.</p></div><div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">{PIPELINE.map((step) => <article key={step.index} className="min-h-56 bg-[#151a17] p-6 transition-colors hover:bg-[#1d2720] sm:p-8"><div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-[#9bc89f]"><span>{step.index}</span><span>{step.label}</span></div><h3 className="mt-14 max-w-xs text-xl font-medium leading-snug tracking-[-0.02em]">{step.title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-[#849087]">{step.body}</p></article>)}</div></div>
        </section>

        <section id="technology" className="mx-auto max-w-[1400px] px-6 py-28 lg:px-12 lg:py-40"><div className="grid gap-14 lg:grid-cols-2 lg:gap-24"><div><p className="text-[10px] uppercase tracking-[0.22em] text-[#9bc89f]">The technical layer</p><h2 className="mt-5 max-w-xl text-4xl font-medium leading-[1.02] tracking-[-0.06em] sm:text-6xl">Built for terrain analysis, not guesswork.</h2></div><div className="grid gap-8 sm:grid-cols-2"><div className="border-l border-[#9bc89f] pl-5"><p className="font-mono text-xs text-[#9bc89f]">RELATIVE DEPTH</p><p className="mt-4 text-sm leading-6 text-[#8d998f]">Read elevation changes from a single optical source without losing the original context.</p></div><div className="border-l border-[#9bc89f] pl-5"><p className="font-mono text-xs text-[#9bc89f]">MEASURABLE OUTPUTS</p><p className="mt-4 text-sm leading-6 text-[#8d998f]">Produce heightfields, calibrated DSMs, normal maps, and textured scenes ready to explore.</p></div></div></div></section>

        <section className="mx-6 mb-20 border border-[#9bc89f]/40 bg-[#a4cfa7] text-[#101311] lg:mx-12"><div className="flex flex-col gap-10 px-6 py-14 sm:px-12 sm:py-20 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] uppercase tracking-[0.22em] opacity-60">Ready to reconstruct?</p><h2 className="mt-5 max-w-2xl text-5xl font-medium leading-[0.95] tracking-[-0.07em] sm:text-7xl">Bring your image<br />into the world.</h2></div><Link href="/analyze" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#101311] px-6 text-sm text-[#edf0e9] transition-transform hover:translate-x-1">Start analysis <ArrowRight className="size-4" /></Link></div></section>
      </main>
      <footer className="border-t border-white/10 px-6 py-8 lg:px-12"><div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-[#778178] sm:flex-row"><span>DepthWizard / Satellite → Terrain → World</span><span>SIH26175 · ISRO · 2026</span></div></footer>
    </div>
  )
}
                        
