import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/app/dashboard': { title: 'Dashboard', subtitle: 'Inventory health overview & KPIs' },
  '/app/upload': { title: 'Upload Dataset', subtitle: 'Import your inventory CSV for analysis' },
  '/app/analysis': { title: 'AI Analysis', subtitle: 'Running the optimization pipeline' },
  '/app/recommendations': { title: 'Recommendations', subtitle: 'AI-generated transfer recommendations' },
  '/app/analytics': { title: 'Analytics', subtitle: 'Deep-dive charts & demand forecast' },
  '/app/search': { title: 'Product Search', subtitle: 'Look up stock & demand for any product' },
  '/app/about': { title: 'About', subtitle: 'How NetworkIQ works under the hood' },
  '/app/contact': { title: 'Contact', subtitle: 'Get in touch with the team' },
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = TITLES[location.pathname] ?? { title: 'NetworkIQ', subtitle: '' };

  return (
    <div className="min-h-screen mesh-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={meta.title} subtitle={meta.subtitle} />
        <main className="p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
