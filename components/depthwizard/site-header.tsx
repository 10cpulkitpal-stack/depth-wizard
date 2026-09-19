import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { BrandLockup } from './logo'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-[#080909]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <Link href="/" aria-label="DepthWizard home" className="text-white"><BrandLockup /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#story" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-cyan-300">About</a>
          <a href="#workflow" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-cyan-300">How it works</a>
          <a href="#technology" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-cyan-300">Technology</a>
          <a href="#terrain" className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/80 transition-colors hover:text-cyan-300">03 / 3D</a>
        </nav>
        <Link href="/analyze" className="flex items-center gap-2 rounded-full border border-white/35 px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-black">Launch DepthWizard <ArrowUpRight className="size-3" /></Link>
      </div>
    </header>
  )
}
