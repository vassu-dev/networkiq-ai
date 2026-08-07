import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: string;            // tailwind gradient classes
  trend?: number;             // percentage
  hint?: string;
  delay?: number;
}

export function KpiCard({ label, value, icon: Icon, accent = 'from-primary to-chart-2', trend, hint, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border glass p-5 shadow-sm transition-shadow hover:shadow-xl"
    >
      {/* decorative gradient blob */}
      <div className={cn('absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-40', accent)} />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight lg:text-3xl">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          {trend !== undefined && (
            <div className={cn('mt-2 inline-flex items-center gap-1 text-xs font-semibold', trend >= 0 ? 'text-chart-3' : 'text-chart-5')}>
              {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {Math.abs(trend)}% vs last cycle
            </div>
          )}
        </div>
        <div className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg', accent)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

export function ChartCard({
  title, description, children, action, className,
}: { title: string; description?: string; children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('rounded-2xl border glass p-5 shadow-sm', className)}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon, title, description, action,
}: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed glass px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-muted-foreground">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
