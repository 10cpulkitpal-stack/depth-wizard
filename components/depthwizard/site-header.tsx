import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { BrandLockup } from './logo'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050606]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <Link href="/" aria-label="DepthWizard home" className="text-white"><BrandLockup /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#story" className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-[#35D6FF]">About</a>
          <a href="#workflow" className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-[#35D6FF]">How It Works</a>
          <a href="#technology" className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-[#35D6FF]">Technology</a>
          <a href="#terrain" className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#35D6FF] transition-colors hover:text-white">03 / 3D</a>
        </nav>
        <Link href="/analyze" className="flex items-center gap-2 rounded-sm border border-white/25 px-3.5 py-2 text-[9px] uppercase tracking-[0.18em] text-white transition-colors hover:border-[#35D6FF] hover:text-[#35D6FF]">Launch DepthWizard <ArrowUpRight className="size-3" /></Link>
      </div>
    </header>
  )
}
