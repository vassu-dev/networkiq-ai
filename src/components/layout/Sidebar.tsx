import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Upload, Sparkles, ListChecks, BarChart3,
  Search, Info, Mail, Network, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/upload', label: 'Upload Dataset', icon: Upload },
  { to: '/app/analysis', label: 'AI Analysis', icon: Sparkles },
  { to: '/app/recommendations', label: 'Recommendations', icon: ListChecks },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/search', label: 'Product Search', icon: Search },
  { to: '/app/about', label: 'About', icon: Info },
  { to: '/app/contact', label: 'Contact', icon: Mail },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-72 flex-col glass-strong border-r transition-transform lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Logo />
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          {nav.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                  />
                )}
                <Icon className={cn('h-[18px] w-[18px] shrink-0', active && 'text-primary')} />
                {label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-chart-2/10 p-4">
            <div className="flex items-center gap-2 text-primary">
              <Network className="h-4 w-4" />
              <span className="text-xs font-semibold">NetworkIQ AI Engine</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Demand prediction, transfer optimization & explanation generation running locally.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
