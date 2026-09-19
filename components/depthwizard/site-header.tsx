import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { BrandLockup } from './logo'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#101311]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <Link href="/" aria-label="DepthWizard home" className="text-[#edf0e9]"><BrandLockup /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#story" className="text-xs uppercase tracking-[0.14em] text-[#89938a] transition-colors hover:text-white">Product</a>
          <a href="#workflow" className="text-xs uppercase tracking-[0.14em] text-[#89938a] transition-colors hover:text-white">How it works</a>
          <a href="#technology" className="text-xs uppercase tracking-[0.14em] text-[#89938a] transition-colors hover:text-white">Technology</a>
        </nav>
        <Link href="/analyze" className="flex items-center gap-2 rounded-full border border-[#9bc89f]/50 px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] text-[#c4d9c5] transition-colors hover:bg-[#9bc89f] hover:text-[#101311]">Launch <ArrowUpRight className="size-3" /></Link>
      </div>
    </header>
  )
}
