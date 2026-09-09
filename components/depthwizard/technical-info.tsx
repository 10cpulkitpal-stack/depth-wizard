import { cn } from '@/lib/utils'

export function DataRows({
  rows,
  className,
}: {
  rows: { label: string; value: string }[]
  className?: string
}) {
  return (
    <dl className={cn('grid grid-cols-1 sm:grid-cols-2', className)}>
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between gap-4 border-b border-border py-2.5"
        >
          <dt className="label-mono">{r.label}</dt>
          <dd className="text-right font-mono text-xs text-foreground">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}
