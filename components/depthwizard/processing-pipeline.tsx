import { Check, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PipelineStep } from '@/lib/depthwizard'

export function ProcessingPipeline({
  steps,
  current,
  className,
}: {
  steps: PipelineStep[]
  current: number
  className?: string
}) {
  return (
    <ol className={cn('space-y-1', className)}>
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li
            key={step.id}
            className={cn(
              'flex items-start gap-4 rounded-lg border px-4 py-3 transition-colors',
              active
                ? 'border-primary/30 bg-primary/[0.04]'
                : 'border-transparent',
            )}
          >
            <span
              className={cn(
                'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono',
                done && 'border-brand-green bg-brand-green text-brand-green-fg',
                active && 'border-primary text-primary',
                !done && !active && 'border-border text-text-muted',
              )}
            >
              {done ? (
                <Check className="size-3.5" strokeWidth={2.5} />
              ) : active ? (
                <Loader className="size-3.5 animate-spin" strokeWidth={2} />
              ) : (
                step.index
              )}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="label-mono">{step.index}</span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    active || done ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
