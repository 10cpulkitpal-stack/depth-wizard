'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppTopBar } from '@/components/depthwizard/app-topbar'
import { ProcessingPipeline } from '@/components/depthwizard/processing-pipeline'
import { MetricCard } from '@/components/depthwizard/metric-card'
import { PIPELINE_STEPS } from '@/lib/depthwizard'

export default function ProcessingPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrent((c) => {
        if (c >= PIPELINE_STEPS.length) return c
        return c + 1
      })
    }, 1100)
    return () => clearInterval(stepTimer)
  }, [])

  useEffect(() => {
    const tick = setInterval(() => setElapsed((e) => e + 0.1), 100)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    if (current >= PIPELINE_STEPS.length) {
      const done = setTimeout(() => router.push('/result'), 900)
      return () => clearTimeout(done)
    }
  }, [current, router])

  const finished = current >= PIPELINE_STEPS.length

  return (
    <div className="flex min-h-screen flex-col">
      <AppTopBar />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-12">
        <div className="max-w-lg">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {finished ? 'Terrain analysis complete' : 'Analyzing terrain'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Converting the satellite image into a navigable terrain scene.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px]">
          <ProcessingPipeline
            steps={PIPELINE_STEPS}
            current={Math.min(current, PIPELINE_STEPS.length)}
          />

          <aside className="space-y-3">
            <MetricCard label="Input" value="1024 × 1024" />
            <MetricCard label="Processing" value={`${elapsed.toFixed(1)} s`} />
            <MetricCard label="Compute" value="CPU" />
            <MetricCard label="Output" value="Relative depth" mono={false} />
          </aside>
        </div>

        <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-green" />
          </span>
          <p className="font-mono text-xs text-muted-foreground">
            {finished ? 'Preparing terrain visualization…' : 'Preparing terrain visualization…'}
          </p>
        </div>
      </main>
    </div>
  )
}
