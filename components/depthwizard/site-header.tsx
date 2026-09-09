import Link from 'next/link'
import { BrandLockup } from './logo'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="DepthWizard home">
          <BrandLockup />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#product" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Product
          </a>
          <a href="#workflow" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Workflow
          </a>
          <a href="#outputs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Outputs
          </a>
        </nav>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
          SIH26175 <span className="mx-1 text-border">|</span> ISRO
        </span>
      </div>
    </header>
  )
}
