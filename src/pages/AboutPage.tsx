import { motion } from 'framer-motion';
import {
  Target, Lightbulb, BrainCircuit, Layers, Network, Server,
  ArrowRight, Database, Cpu, BarChart3, Sparkles, CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/primitives';

export function AboutPage() {
  return (
    <div className="space-y-10">
      {/* Problem statement */}
      <Section heading="Problem Statement" icon={Target}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Retail chains operating across multiple stores face a constant balancing act: some locations pile up excess inventory
          that ties up working capital and racks up holding costs, while others run out of fast-moving products and lose sales.
          Managers typically rely on manual spreadsheets and intuition to decide what to move where — a slow, error-prone process
          that misses cross-store opportunities and reacts only after stockouts have already happened.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Without demand forecasting and an automated transfer engine, networks leak profit every day through avoidable overstock
          and avoidable shortages — and no one has a single, explainable view of where the biggest wins are hiding.
        </p>
      </Section>

      {/* Solution */}
      <Section heading="The NetworkIQ Solution" icon={Lightbulb}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          NetworkIQ ingests a single inventory CSV spanning all stores and runs a complete optimization pipeline in seconds:
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            'Classifies every SKU-store pair as Critical, Low Stock, Optimal, or Overstock',
            'Predicts next-period demand using a weighted moving average with category trend blending',
            'Pairs overstocked locations with shortage locations to recommend optimal transfer quantities',
            'Estimates transfer cost, expected savings, and expected profit for every recommendation',
            'Generates a human-readable explanation for each transfer so teams can audit decisions',
            'Produces an executive AI summary plus interactive analytics and an inventory heatmap',
          ].map((t, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="flex gap-2.5 text-sm"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-chart-3" /> {t}
            </motion.li>
          ))}
        </ul>
      </Section>

      {/* AI workflow */}
      <Section heading="AI Workflow" icon={BrainCircuit}>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { icon: Database, t: 'Demand Prediction', d: 'Blends each SKU\'s demand with the store average and a category trend factor to forecast the next period.' },
            { icon: Cpu, t: 'Inventory Analysis', d: 'Computes stock-to-demand ratios, classifies status, and quantifies shortage, excess, and revenue risk.' },
            { icon: Network, t: 'Recommendation Engine', d: 'Matches overstock donors to shortage receivers, sizes transfers, and ranks by expected savings.' },
            { icon: Sparkles, t: 'Explanation Generator', d: 'Writes a plain-English rationale for every transfer, citing stores, quantities, and expected impact.' },
          ].map(({ icon: I, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border glass p-5"
            >
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <I className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold">{t}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{d}</p>
              {i < 3 && <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground/40 md:block" />}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Tech stack */}
      <Section heading="Technology Stack" icon={Layers}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { layer: 'Frontend', items: ['React 19', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'Framer Motion', 'Recharts', 'React Router'], icon: BarChart3 },
            { layer: 'AI Engine', items: ['Weighted moving average', 'Category trend blending', 'Greedy transfer matching', 'Explanation generator'], icon: BrainCircuit },
            { layer: 'Data Layer', items: ['CSV parser & validator', 'In-browser analysis', 'Export to CSV', 'Sample dataset generator'], icon: Database },
          ].map(({ layer, items, icon: I }) => (
            <div key={layer} className="rounded-2xl border glass p-5">
              <div className="mb-3 flex items-center gap-2">
                <I className="h-5 w-5 text-primary" />
                <p className="font-semibold">{layer}</p>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {items.map((it) => <li key={it} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> {it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Architecture diagram */}
      <Section heading="Architecture Diagram" icon={Server}>
        <div className="rounded-2xl border glass p-6">
          <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
            <ArchNode icon={Database} title="CSV Upload" sub="User inventory data" color="from-primary to-chart-2" />
            <ArchArrow />
            <ArchNode icon={Cpu} title="AI Engine" sub="Demand · Analysis · Matching" color="from-chart-2 to-chart-3" />
            <ArchArrow />
            <ArchNode icon={Sparkles} title="Recommendations" sub="Transfers + explanations" color="from-chart-3 to-chart-4" />
            <ArchArrow />
            <ArchNode icon={BarChart3} title="Dashboard" sub="KPIs · Charts · Export" color="from-chart-4 to-chart-6" />
          </div>
          <div className="mt-6 rounded-xl bg-muted/40 p-4 text-center text-xs text-muted-foreground">
            Single-page architecture — the browser uploads CSV, the in-browser AI engine runs the full pipeline, and results render in the React dashboard. No server round-trip required for the demo.
          </div>
        </div>
      </Section>

      <div className="flex justify-center pb-4">
        <Link to="/app/upload"><Button size="lg"><Sparkles className="mr-2 h-4 w-4" /> Try it now</Button></Link>
      </div>
    </div>
  );
}

function Section({ heading, icon: I, children }: { heading: string; icon: typeof Target; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.4 }}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <I className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">{heading}</h2>
      </div>
      <div className="rounded-2xl border glass p-6">{children}</div>
    </motion.section>
  );
}

function ArchNode({ icon: I, title, sub, color }: { icon: typeof Database; title: string; sub: string; color: string }) {
  return (
    <div className="flex-1 rounded-2xl border glass p-4 text-center">
      <div className={`mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <I className="h-6 w-6" />
      </div>
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function ArchArrow() {
  return <ArrowRight className="mx-auto hidden h-5 w-5 shrink-0 text-muted-foreground/40 lg:block" />;
}
