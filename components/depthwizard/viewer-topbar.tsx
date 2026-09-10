'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { LogoMark } from './logo'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Pipeline', href: '/result' },
  { label: 'Team', href: '/#outputs' },
  { label: 'App', href: '/analyze' },
]

export function ViewerTopBar({
  steps,
  active,
  children,
}: {
  steps: string[]
  active: number
  children?: ReactNode
}) {
  return (
    <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex h-12 items-center justify-between gap-3 border-b border-border/70 bg-card/70 px-3 backdrop-blur">
      <Link href="/" className="flex items-center gap-2 text-foreground" aria-label="DepthWizard home">
        <span className="flex size-7 items-center justify-center rounded-md border border-border bg-card text-brand-green">
          <LogoMark className="size-4" />
        </span>
        <span className="text-[13px] font-semibold tracking-tight">DepthWizard</span>
      </Link>

      <nav
        className="hidden items-center gap-2 md:flex"
        aria-label="Pipeline stage"
      >
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <span className="text-text-muted" aria-hidden>&rarr;</span>}
            <span
              className={cn(
                'font-mono text-[11px] uppercase tracking-[0.12em]',
                i === active ? 'text-foreground' : 'text-text-muted',
              )}
            >
              {s}
            </span>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-1">
        <nav className="mr-1 hidden items-center gap-3 xl:flex" aria-label="Sections">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </header>
  )
}
