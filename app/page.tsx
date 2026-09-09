import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
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
}

const STEPS = [
  { index: '01', title: 'Upload', body: 'Provide an RGB satellite image.' },
  { index: '02', title: 'Analyze', body: 'Estimate relative depth and terrain structure.' },
  { index: '03', title: 'Explore', body: 'Inspect the reconstruction in 3D.' },
  { index: '04', title: 'Export', body: 'Download generated terrain artifacts.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section id="product" className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24">
          <div className="max-w-3xl">
            <p className="label-mono">Terrain intelligence · Satellite → Terrain</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-6xl">
              Turn a satellite image into a navigable terrain scene.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Estimate terrain depth from a single RGB satellite image and explore the
              resulting 2.5D reconstruction in an interactive 3D environment.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/analyze"
                className={cn(
                  buttonVariants(),
                  'h-11 bg-brand-green px-5 text-brand-green-fg hover:bg-brand-green/90',
                )}
              >
                Upload Satellite Image
                <ArrowRight />
              </Link>
              <Link
                href="/result"
                className={cn(buttonVariants({ variant: 'outline' }), 'h-11 px-5')}
              >
                <Play />
                Explore Demo
              </Link>
            </div>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-xl border border-border bg-card">
            <div className="h-[420px] md:h-[560px]">
              <TerrainViewer controls={HERO_CONTROLS} />
            </div>
            <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1">
              <span className="w-fit rounded-md border border-border bg-card/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted backdrop-blur">
                2.5D reconstruction · relative depth
              </span>
            </div>
            <div className="pointer-events-none absolute bottom-4 right-4 flex gap-2">
              <span className="rounded-md border border-border bg-card/90 px-2 py-1 font-mono text-[10px] text-text-muted backdrop-blur">
                rgb_2021.tif
              </span>
              <span className="rounded-md border border-border bg-card/90 px-2 py-1 font-mono text-[10px] text-text-muted backdrop-blur">
                1024 × 1024
              </span>
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className="mx-auto max-w-6xl px-6 py-14"
        >
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.index} className="bg-card p-6">
                <span className="font-mono text-sm text-brand-green">{s.index}</span>
                <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="outputs" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-card p-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Built for terrain analysis, not guesswork.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                DepthWizard produces a heightfield, calibrated DSM, normal map and a
                textured 3D scene — every output labelled with its basis so relative and
                metric results are never confused.
              </p>
            </div>
            <Link
              href="/analyze"
              className={cn(
                buttonVariants(),
                'h-11 shrink-0 bg-brand-green px-5 text-brand-green-fg hover:bg-brand-green/90',
              )}
            >
              Start an analysis
              <ArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-8 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
            DepthWizard · Satellite → Terrain
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
            SIH26175 | ISRO
          </p>
        </div>
      </footer>
    </div>
  )
}
