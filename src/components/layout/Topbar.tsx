import { useState, useRef, useEffect } from 'react';
import {
  Menu, Bell, Sun, Moon, Search, Download, ChevronDown, CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { rowsToCSV, downloadFile } from '@/lib/csv';

export function Topbar({ onMenuClick, title, subtitle }: { onMenuClick: () => void; title: string; subtitle?: string }) {
  const { theme, toggleTheme, notifications, dismissNotification, analysis } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.length;

  const handleExportCSV = () => {
    if (!analysis) return;
    const csv = rowsToCSV(analysis.rows.map((r) => ({ ...r })));
    downloadFile(`networkiq_analysis_${Date.now()}.csv`, csv);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b glass-strong px-4 lg:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Quick search */}
      <div className="relative hidden md:block">
        <button
          onClick={() => { setSearchOpen(true); navigate('/app/search'); }}
          className="flex items-center gap-2 rounded-lg border bg-background/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <Search className="h-4 w-4" />
          <span>Search products…</span>
          <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-semibold">/</kbd>
        </button>
      </div>

      {/* Export */}
      {analysis && (
        <button
          onClick={handleExportCSV}
          className="hidden items-center gap-2 rounded-lg border bg-background/50 px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary sm:flex"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      )}

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'dark' ? (
            <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <Sun className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Moon className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-chart-5 px-1 text-[10px] font-bold text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute right-0 top-12 w-80 overflow-hidden rounded-xl border glass-strong shadow-2xl"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="text-sm font-semibold">Notifications</span>
                <span className="text-xs text-muted-foreground">{unread} new</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-chart-3" />
                    All caught up — no new alerts.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="flex gap-3 border-b px-4 py-3 last:border-0 hover:bg-accent/50">
                      <span className={cn(
                        'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                        n.type === 'success' && 'bg-chart-3',
                        n.type === 'warning' && 'bg-chart-4',
                        n.type === 'error' && 'bg-chart-5',
                        n.type === 'info' && 'bg-primary'
                      )} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/70">{n.time}</p>
                      </div>
                      <button onClick={() => dismissNotification(n.id)} className="text-muted-foreground hover:text-foreground">
                        <ChevronDown className="h-3.5 w-3.5 rotate-90" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
