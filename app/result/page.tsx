'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CircleCheck, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AppTopBar } from '@/components/depthwizard/app-topbar'
import { MetricCard } from '@/components/depthwizard/metric-card'
import { TerrainWorkspace } from '@/components/depthwizard/terrain-workspace'
import { DataRows } from '@/components/depthwizard/technical-info'
import { ArtifactList } from '@/components/depthwizard/artifact-list'
import { ExportDrawer } from '@/components/depthwizard/export-drawer'
import {
  ANALYSIS_DETAILS,
  ARTIFACTS,
  SPATIAL_CONTEXT,
  TECHNICAL_NOTES,
  type Artifact,
} from '@/lib/depthwizard'
import { artifactUrl } from '@/lib/api'

type ViewTab = 'original' | 'depth' | 'scene'

function download(a: Artifact) {
  const link = document.createElement('a')
  link.href = artifactUrl('job_8f21c4', a.id)
  link.download = a.id
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
    </div>
  )
}

export default function ResultPage() {
  const [tab, setTab] = useState<ViewTab>('scene')
  const [exportOpen, setExportOpen] = useState(false)

  const tabs: { id: ViewTab; label: string }[] = [
    { id: 'original', label: 'Original' },
    { id: 'depth', label: 'Predicted Depth' },
    { id: 'scene', label: '3D Reconstruction' },
  ]

  return (
    <div className="min-h-screen">
      <AppTopBar>
        <Link
          href="/viewer"
          className="hidden text-sm font-medium text-brand-green transition-colors hover:underline sm:inline"
        >
          Open 3D Viewer →
        </Link>
        <Button
          size="sm"
          className="bg-brand-green text-brand-green-fg hover:bg-brand-green/90"
          onClick={() => setExportOpen(true)}
        >
          <Download />
          Export
        </Button>
      </AppTopBar>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Title + status */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Terrain analysis complete
            </h1>
            <p className="mt-1 font-mono text-sm text-text-muted">rgb_2021.tif</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green">
            <CircleCheck className="size-3.5" strokeWidth={2} />
            Analysis complete
          </span>
        </div>

        {/* Metric cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard label="Input raster" value="1,024 × 1,024" />
          <MetricCard label="Processing" value="179.1 s" />
          <MetricCard label="Compute" value="CPU" />
          <MetricCard
            label="Output basis"
            value="RGB-only"
            sub="Relative / scale-ambiguous"
          />
        </div>

        {/* View tabs */}
        <div className="mt-8 flex items-center gap-1 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'relative -mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'border-brand-green text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* View content */}
        <div className="mt-4">
          {tab === 'scene' && <TerrainWorkspace className="h-[560px]" />}
          {tab === 'original' && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <img
                src="/textures/satellite.png"
                alt="Original RGB satellite raster"
                className="h-[560px] w-full object-cover"
              />
            </div>
          )}
          {tab === 'depth' && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <img
                src="/textures/depth.png"
                alt="Predicted relative depth map"
                className="h-[560px] w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Analysis details + spatial context */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <section>
            <SectionHeading title="Analysis details" />
            <DataRows rows={ANALYSIS_DETAILS} className="gap-x-8" />
          </section>
          <section>
            <SectionHeading title="Spatial context" />
            <DataRows rows={SPATIAL_CONTEXT} className="grid-cols-1 sm:grid-cols-1" />
          </section>
        </div>

        {/* Technical notes */}
        <section className="mt-14">
          <SectionHeading title="Technical notes" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TECHNICAL_NOTES.map((n) => (
              <div key={n.id} className="rounded-lg border border-border bg-card p-4">
                <p className="label-mono">{n.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{n.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benchmark fit */}
        <section className="mt-14">
          <SectionHeading title="Benchmark fit" sub="Feasibility evaluation" />
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-5 py-6">
            <span className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-text-muted font-mono text-xs">
              —
            </span>
            <p className="text-sm text-muted-foreground">
              No reference metrics for this scene.
            </p>
          </div>
        </section>

        {/* Artifacts */}
        <section className="mt-14 mb-6">
          <div className="mb-4 flex items-center justify-between">
            <SectionHeading title="Artifacts" />
            <button
              type="button"
              onClick={() => setExportOpen(true)}
              className="text-sm font-medium text-brand-green transition-colors hover:underline"
            >
              Export all →
            </button>
          </div>
          <ArtifactList artifacts={ARTIFACTS} onDownload={download} />
        </section>

        {/* Launch viewer */}
        <section className="mb-16">
          <Link
            href="/viewer"
            className="flex items-center justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-ring"
          >
            <div>
              <h3 className="text-base font-semibold text-foreground">Open the dedicated 3D viewer</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore, fly and tour the terrain in a full-screen environment.
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-full bg-brand-green text-brand-green-fg">
              <ArrowRight className="size-5" strokeWidth={2} />
            </span>
          </Link>
        </section>
      </main>

      <ExportDrawer open={exportOpen} onClose={() => setExportOpen(false)} onDownload={download} />
    </div>
  )
}
