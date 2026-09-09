import { cn } from '@/lib/utils'

export function MetricCard({
  label,
  value,
  sub,
  mono = true,
  className,
}: {
  label: string
  value: string
  sub?: string
  mono?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4',
        className,
      )}
    >
      <p className="label-mono">{label}</p>
      <p
        className={cn(
          'mt-2 text-lg text-foreground',
          mono ? 'font-mono' : 'font-medium',
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 font-mono text-[11px] text-text-muted">{sub}</p>}
    </div>
  )
}
