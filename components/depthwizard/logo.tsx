import { cn } from '@/lib/utils'

// Minimal topographic contour mark: nested chevrons reading as elevation lines.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-6', className)}
      aria-hidden="true"
    >
      <path d="M3 19 L12 6 L21 19" />
      <path d="M7 19 L12 11.5 L17 19" />
      <path d="M10.4 19 L12 16.5 L13.6 19" />
    </svg>
  )
}

export function BrandLockup({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-brand-green">
        <LogoMark className="size-5" />
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          DepthWizard
        </span>
        {!compact && (
          <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
            Satellite → Terrain
          </span>
        )}
      </div>
    </div>
  )
}
