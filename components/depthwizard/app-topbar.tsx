import Link from 'next/link'
import type { ReactNode } from 'react'
import { BrandLockup } from './logo'

export function AppTopBar({ children }: { children?: ReactNode }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-5">
      <div className="flex items-center gap-5">
        <Link href="/" aria-label="DepthWizard home">
          <BrandLockup compact />
        </Link>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted sm:block">
          SIH26175 <span className="mx-1 text-border">|</span> ISRO
        </span>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  )
}
