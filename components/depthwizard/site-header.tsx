import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { BrandLockup } from './logo'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-[#080909]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <Link href="/" aria-label="DepthWizard home" className="text-white"><BrandLockup /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#story" className="text-[10px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white">About</a>
          <a href="#workflow" className="text-[10px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white">How it works</a>
          <a href="#technology" className="text-[10px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white">Technology</a>
          <a href="#terrain" className="text-[10px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white">3D</a>
        </nav>
        <Link href="/analyze" className="flex items-center gap-2 rounded-full border border-white/35 px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-black">Launch DepthWizard <ArrowUpRight className="size-3" /></Link>
      </div>
    </header>
  )
}
