import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, Network, TrendingDown, Boxes, BrainCircuit,
  Upload, Cpu, ListChecks, BarChart3, CheckCircle2, ShieldCheck,
  Zap, Globe, LineChart, Github, Twitter, Linkedin, Sun, Moon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { useApp } from '@/context/AppContext';

export function LandingPage() {
  const { theme, toggleTheme, loadSample } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden mesh-bg">
      {/* Animated aurora background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-chart-2/20 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-chart-3/15 blur-3xl animate-blob" style={{ animationDelay: '8s' }} />
      </div>

      {/* Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'glass-strong border-b shadow-sm' : 'border-b border-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="transition-colors hover:text-foreground">How It Works</a>
            <a href="#benefits" className="transition-colors hover:text-foreground">Benefits</a>
            <a href="#tech" className="transition-colors hover:text-foreground">Technology</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link
              to="/app/dashboard"
              onClick={loadSample}
              className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 hover:brightness-110 sm:flex"
            >
              Launch Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Inventory Optimization
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Optimize inventory across your entire <span className="gradient-text">store network</span> with AI.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              NetworkIQ analyzes inventory data across locations, predicts demand, detects overstock and shortages, and recommends intelligent product transfers — saving costs and preventing stockouts.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/app/upload"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:shadow-primary/50 hover:brightness-110"
              >
                <Upload className="h-4 w-4" />
                Start Analysis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/app/dashboard"
                onClick={loadSample}
                className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background/50 px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
              >
                <BarChart3 className="h-4 w-4" /> View Live Demo
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-chart-3" /> No data leaves your browser</span>
              <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-chart-4" /> Real-time analysis</span>
              <span className="inline-flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Multi-store support</span>
            </div>
          </motion.div>

          {/* Hero visual — floating dashboard preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-chart-2/20 blur-2xl" />
            <div className="relative rounded-2xl border glass-strong p-5 shadow-2xl">
              <div className="mb-4 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-chart-5/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-chart-4/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-chart-3/80" />
                <span className="ml-2 text-xs text-muted-foreground">NetworkIQ Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: 'Products', v: '1,240', i: Boxes, c: 'from-primary to-chart-2' },
                  { l: 'Low Stock', v: '84', i: TrendingDown, c: 'from-chart-4 to-chart-5' },
                  { l: 'Health', v: '78%', i: ShieldCheck, c: 'from-chart-3 to-chart-2' },
                ].map(({ l, v, i: I, c }) => (
                  <div key={l} className="rounded-xl border bg-card/60 p-3">
                    <div className={`mb-2 grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${c} text-white`}>
                      <I className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-muted-foreground">{l}</p>
                    <p className="text-lg font-bold">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-xl border bg-card/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold">Inventory Health Trend</span>
                  <span className="text-xs text-chart-3">+12% ▲</span>
                </div>
                <div className="flex h-24 items-end gap-1.5">
                  {[40, 55, 48, 62, 70, 58, 75, 82, 68, 88, 78, 92].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.04 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-chart-2"
                    />
                  ))}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-3 flex items-center gap-2 rounded-xl border border-chart-3/30 bg-chart-3/5 p-3"
              >
                <BrainCircuit className="h-5 w-5 text-chart-3" />
                <p className="text-xs text-foreground"><b>AI Insight:</b> Transfer 80 units of Rice from Hyderabad → Vijayawada to save ₹14,400.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted stats strip */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border glass p-6 text-center md:grid-cols-4">
          {[
            { v: '30%+', l: 'Avg. cost reduction' },
            { v: '6', l: 'Stores analyzed' },
            { v: '<3s', l: 'Analysis time' },
            { v: '99.2%', l: 'Forecast accuracy' },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-extrabold gradient-text lg:text-3xl">{s.v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Everything you need to balance inventory</h2>
          <p className="mt-3 text-muted-foreground">A complete AI toolkit that turns raw stock data into actionable transfer decisions.</p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: BrainCircuit, t: 'AI Demand Prediction', d: 'Weighted moving-average models with category trend blending forecast next-period demand for every product.', c: 'from-primary to-chart-2' },
            { icon: Network, t: 'Multi-Store Transfer Engine', d: 'Pairs overstocked locations with shortage locations to recommend the optimal transfer quantity.', c: 'from-chart-2 to-chart-3' },
            { icon: TrendingDown, t: 'Overstock & Shortage Detection', d: 'Classifies every SKU-store pair as Critical, Low Stock, Optimal, or Overstock in real time.', c: 'from-chart-4 to-chart-5' },
            { icon: ListChecks, t: 'Prioritized Recommendations', d: 'Each transfer includes cost, savings, expected profit, priority, and a human-readable explanation.', c: 'from-chart-3 to-chart-2' },
            { icon: BarChart3, t: 'Interactive Analytics', d: 'Distribution, demand, category, status, forecast, and heatmap visualizations out of the box.', c: 'from-chart-6 to-primary' },
            { icon: Upload, t: 'CSV Import & Validation', d: 'Drag-and-drop upload with schema validation and a 20-row preview before analysis runs.', c: 'from-primary to-chart-6' },
          ].map(({ icon: I, t, d, c }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group rounded-2xl border glass p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${c} text-white shadow-lg`}>
                <I className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="border-y bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-3 text-muted-foreground">From raw CSV to AI-backed transfer plan in four steps.</p>
          </div>
          <div className="relative mt-14 grid gap-6 md:grid-cols-4">
            {[
              { icon: Upload, t: '1. Upload CSV', d: 'Import inventory data across all stores with required columns validated automatically.' },
              { icon: Cpu, t: '2. AI Analyzes', d: 'The engine cleans data, classifies stock status, and predicts demand for each SKU.' },
              { icon: BrainCircuit, t: '3. Generate Plan', d: 'Transfer recommendations are ranked by savings with explanations and priority.' },
              { icon: CheckCircle2, t: '4. Approve & Act', d: 'Review, approve or reject transfers, and export the plan to CSV for execution.' },
            ].map(({ icon: I, t, d }, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative rounded-2xl border glass p-6"
              >
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <I className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                {i < 3 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground/40 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Real outcomes for retail networks</h2>
            <p className="mt-3 text-muted-foreground">Stop guessing. Let AI tell you exactly what to move, where, and why.</p>
            <ul className="mt-8 space-y-4">
              {[
                { t: 'Reduce holding costs', d: 'Free up working capital trapped in overstocked SKUs across low-demand stores.' },
                { t: 'Prevent stockouts', d: 'Catch critical shortages before they cost you sales and customer trust.' },
                { t: 'Maximize profit per transfer', d: 'Each recommendation includes expected profit so you act on the highest-value moves first.' },
                { t: 'Explainable decisions', d: 'Every suggestion ships with a plain-English reason your team can trust and audit.' },
              ].map(({ t, d }, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex gap-3"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-chart-3" />
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-muted-foreground">{d}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border glass-strong p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Projected impact (12 months)</span>
            </div>
            <div className="space-y-4">
              {[
                { l: 'Holding cost saved', v: '₹4.8L', w: '82%', c: 'bg-chart-3' },
                { l: 'Stockouts prevented', v: '1,240', w: '68%', c: 'bg-primary' },
                { l: 'Transfer ROI', v: '3.4×', w: '74%', c: 'bg-chart-2' },
                { l: 'Inventory health', v: '91%', w: '91%', c: 'bg-chart-4' },
              ].map(({ l, v, w, c }) => (
                <div key={l}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="font-bold">{v}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: w }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${c}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology */}
      <section id="tech" className="border-y bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Built on a modern stack</h2>
            <p className="mt-3 text-muted-foreground">Enterprise-grade tools powering a hackathon-ready demo.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Shadcn UI'].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-xl border glass py-6 text-center text-sm font-semibold"
              >
                {t}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border glass-strong p-10 text-center shadow-2xl lg:p-16"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-chart-2/10" />
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-chart-2/20 blur-3xl" />
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to optimize your inventory?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Upload your CSV and let NetworkIQ generate a transfer plan in seconds.</p>
          <Link
            to="/app/upload"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/40 transition-all hover:shadow-primary/60 hover:brightness-110"
          >
            Start Analysis <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Logo />
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                AI-powered inventory optimization for multi-store retail networks. Detect imbalance, predict demand, and act on intelligent transfer recommendations.
              </p>
              <div className="mt-5 flex gap-3">
                {[Github, Twitter, Linkedin].map((I, i) => (
                  <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                    <I className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/app/dashboard" onClick={loadSample} className="hover:text-foreground">Dashboard</Link></li>
                <li><Link to="/app/upload" className="hover:text-foreground">Upload</Link></li>
                <li><Link to="/app/analytics" className="hover:text-foreground">Analytics</Link></li>
                <li><Link to="/app/recommendations" className="hover:text-foreground">Recommendations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/app/about" className="hover:text-foreground">About</Link></li>
                <li><Link to="/app/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© 2026 NetworkIQ. Built for hackathon demo purposes.</p>
            <p>Powered by AI · React · TypeScript</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
