import { Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'h-11 w-11' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const text = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl';
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <div className={cn(
        'relative grid place-items-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-white shadow-lg shadow-primary/30',
        dim
      )}>
        <Boxes className="h-1/2 w-1/2" strokeWidth={2.2} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-chart-3 ring-2 ring-background" />
      </div>
      <div className="leading-none">
        <span className={cn('font-extrabold tracking-tight', text)}>
          Network<span className="gradient-text">IQ</span>
        </span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
          AI Inventory Optimization
        </span>
      </div>
    </div>
  );
}
