import { useNavigate } from 'react-router-dom';
import {
  BarChart3, PieChart as PieIcon, AreaChart as AreaIcon, LineChart as LineIcon,
  Flame, TrendingUp, TrendingDown, Sparkles, Store as StoreIcon,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend, RadialBarChart, RadialBar,
} from 'recharts';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ChartCard, EmptyState, SectionHeading } from '@/components/ui/primitives';
import { Button } from '@/components/ui/button';
import { formatCompact, formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

const tooltipStyle = {
  background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))',
  borderRadius: '0.75rem', fontSize: '12px', color: 'hsl(var(--popover-foreground))',
} as const;

export function AnalyticsPage() {
  const { analysis } = useApp();
  const navigate = useNavigate();

  if (!analysis) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No analytics available"
        description="Run the AI analysis to unlock charts, forecasts, and the inventory heatmap."
        action={<Button onClick={() => navigate('/app/analysis')}>Run Analysis</Button>}
      />
    );
  }

  const { analytics } = analysis;

  return (
    <div className="space-y-6">
      {/* Chart type pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { icon: BarChart3, label: 'Bar' }, { icon: PieIcon, label: 'Pie' },
          { icon: AreaIcon, label: 'Area' }, { icon: LineIcon, label: 'Line' },
          { icon: Flame, label: 'Heatmap' },
        ].map(({ icon: I, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 rounded-full border glass px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <I className="h-3.5 w-3.5" /> {label}
          </span>
        ))}
      </div>

      {/* Top / worst products */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Top Selling Products" description="Highest demand across the network" action={<TrendingUp className="h-4 w-4 text-chart-3" />}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topProducts} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis type="category" dataKey="product" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="demand" name="Demand" radius={[0, 6, 6, 0]} fill="hsl(var(--chart-3))" />
              <Bar dataKey="stock" name="Stock" radius={[0, 6, 6, 0]} fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Worst Performing Products" description="Largest shortages to address" action={<TrendingDown className="h-4 w-4 text-chart-5" />}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.worstProducts} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis type="category" dataKey="product" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="shortage" name="Shortage" radius={[0, 6, 6, 0]} fill="hsl(var(--chart-5))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Store comparison + demand forecast */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Store Comparison" description="Stock, demand & health score by store" action={<StoreIcon className="h-4 w-4 text-primary" />}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.storeComparison} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="store" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={formatCompact} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="stock" name="Stock" fill="hsl(var(--chart-2))" radius={[6,6,0,0]} />
              <Bar dataKey="demand" name="Demand" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
              <Bar dataKey="health" name="Health %" fill="hsl(var(--chart-3))" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Demand Forecast" description="Predicted demand with confidence band" action={<LineIcon className="h-4 w-4 text-chart-6" />}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.demandForecast} margin={{ left: -10 }}>
              <defs>
                <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-6))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--chart-6))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="period" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="upper" name="Upper bound" stroke="none" fill="url(#bandGrad)" />
              <Area type="monotone" dataKey="lower" name="Lower bound" stroke="none" fill="hsl(var(--background))" />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="predicted" name="Predicted" stroke="hsl(var(--chart-6))" strokeWidth={2.5} strokeDasharray="5 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Monthly inventory + pie chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Monthly Inventory" description="Stock & demand trend" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics.monthlyTrend} margin={{ left: -10 }}>
              <defs>
                <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
                <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={formatCompact} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="stock" name="Stock" stroke="hsl(var(--primary))" fill="url(#m1)" strokeWidth={2} />
              <Area type="monotone" dataKey="demand" name="Demand" stroke="hsl(var(--chart-4))" fill="url(#m2)" strokeWidth={2} />
              <Line type="monotone" dataKey="transfers" name="Transfers" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Share" description="Inventory value distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={analytics.productCategories.map((c) => ({ name: c.category, value: c.value }))} dataKey="value" nameKey="name" innerRadius={45} outerRadius={95} paddingAngle={2}>
                {analytics.productCategories.map((_, i) => (
                  <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Inventory Heatmap */}
      <SectionHeading title="Inventory Heatmap" subtitle="Stock-to-demand ratio per store & product — red = shortage, green = surplus" />
      <Heatmap />

      {/* Stock status radial */}
      <ChartCard title="Stock Status Breakdown" description="Health distribution across the network">
        <ResponsiveContainer width="100%" height={260}>
          <RadialBarChart
            innerRadius="20%" outerRadius="100%"
            data={analytics.stockStatus.map((s, i) => ({ name: s.name, value: s.value, fill: s.color }))}
            startAngle={90} endAngle={-270}
          >
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'hsl(var(--muted))' }} />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

const PIE_PALETTE = [
  'hsl(var(--chart-1))','hsl(var(--chart-2))','hsl(var(--chart-3))','hsl(var(--chart-4))',
  'hsl(var(--chart-5))','hsl(var(--chart-6))','hsl(var(--primary))','hsl(var(--chart-2))',
];

function Heatmap() {
  const { analysis } = useApp();
  if (!analysis) return null;
  const data = analysis.analytics.heatmap;

  const stores = [...new Set(data.map((d) => d.store))];
  const products = [...new Set(data.map((d) => d.product))].slice(0, 12);

  // Color scale: ratio 0 = critical red, ~1 = neutral, >1.5 = green
  const colorFor = (ratio: number) => {
    if (ratio === 0) return 'hsl(var(--muted))';
    if (ratio < 0.4) return 'hsl(var(--chart-5))';
    if (ratio < 0.8) return 'hsl(var(--chart-4))';
    if (ratio <= 1.3) return 'hsl(var(--chart-3))';
    if (ratio <= 2) return 'hsl(var(--chart-2))';
    return 'hsl(var(--chart-6))';
  };
  const opacityFor = (ratio: number) => {
    if (ratio === 0) return 0.3;
    return Math.min(0.95, 0.35 + Math.abs(ratio - 1) * 0.3);
  };

  const cell = (store: string, product: string) => data.find((d) => d.store === store && d.product === product);

  return (
    <div className="overflow-x-auto rounded-2xl border glass p-4">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-card px-2 py-1.5 text-left font-semibold">Store \ Product</th>
            {products.map((p) => (
              <th key={p} className="px-1 py-1.5 text-center font-medium text-muted-foreground" title={p}>
                <div className="mx-auto max-w-[60px] truncate">{p}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store}>
              <td className="sticky left-0 z-10 bg-card px-2 py-1.5 font-semibold">{store}</td>
              {products.map((product) => {
                const c = cell(store, product);
                if (!c) return <td key={product} className="p-1"><div className="h-9 rounded-md bg-muted/40" /></td>;
                return (
                  <td key={product} className="p-1">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="grid h-9 place-items-center rounded-md text-[10px] font-bold text-white"
                      style={{ background: colorFor(c.ratio), opacity: opacityFor(c.ratio) }}
                      title={`${store} · ${product}\nStock: ${c.stock} · Demand: ${c.demand} · Ratio: ${c.ratio.toFixed(2)}`}
                    >
                      {c.ratio.toFixed(1)}
                    </motion.div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
        <Legend2 color="hsl(var(--chart-5))" label="Critical" />
        <Legend2 color="hsl(var(--chart-4))" label="Low" />
        <Legend2 color="hsl(var(--chart-3))" label="Optimal" />
        <Legend2 color="hsl(var(--chart-2))" label="Surplus" />
        <Legend2 color="hsl(var(--chart-6))" label="Overstock" />
      </div>
    </div>
  );
}

function Legend2({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: color }} /> {label}</span>;
}
