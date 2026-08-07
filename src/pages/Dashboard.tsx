import { Link } from 'react-router-dom';
import {
  Boxes, Store, AlertTriangle, PackageX, Wallet, ListChecks,
  Activity, Sparkles, Upload, ArrowRight, TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend, RadialBarChart, RadialBar,
} from 'recharts';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { KpiCard, ChartCard, EmptyState, SectionHeading } from '@/components/ui/primitives';
import { formatCurrency, formatCompact, formatNumber, formatDateTime } from '@/lib/format';
import { Button } from '@/components/ui/button';

const STATUS_COLORS_HSL: Record<string, string> = {
  'Optimal': 'hsl(var(--chart-3))',
  'Low Stock': 'hsl(var(--chart-4))',
  'Overstock': 'hsl(var(--chart-6))',
  'Critical': 'hsl(var(--chart-5))',
};

export function Dashboard() {
  const { analysis, fileMeta } = useApp();

  if (!analysis) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No analysis yet"
        description="Upload an inventory CSV and run the AI analysis to see your dashboard KPIs, charts, and recommendations."
        action={
          <div className="flex gap-3">
            <Link to="/app/upload"><Button><Upload className="mr-2 h-4 w-4" /> Upload Dataset</Button></Link>
            <Link to="/app/analysis"><Button variant="outline">Run Analysis</Button></Link>
          </div>
        }
      />
    );
  }

  const { summary, analytics, generatedAt } = analysis;

  const healthData = [{ name: 'Health', value: summary.inventoryHealth, fill: 'hsl(var(--chart-3))' }];

  return (
    <div className="space-y-6">
      {/* AI summary banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border glass p-5 lg:p-6"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Executive Summary</p>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">{analysis.aiSummary}</p>
              <p className="mt-2 text-xs text-muted-foreground/70">Generated {formatDateTime(generatedAt)}</p>
            </div>
          </div>
          <Link to="/app/recommendations" className="shrink-0">
            <Button variant="outline" size="sm">View Recommendations <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Products" value={formatNumber(summary.totalProducts)} icon={Boxes} accent="from-primary to-chart-2" trend={8} delay={0} />
        <KpiCard label="Total Stores" value={String(summary.totalStores)} icon={Store} accent="from-chart-2 to-chart-3" delay={0.05} />
        <KpiCard label="Low Stock" value={formatNumber(summary.lowStockCount + summary.criticalCount)} icon={AlertTriangle} accent="from-chart-4 to-chart-5" trend={-12} delay={0.1} hint={`${summary.criticalCount} critical`} />
        <KpiCard label="Overstock" value={formatNumber(summary.overstockCount)} icon={PackageX} accent="from-chart-6 to-primary" delay={0.15} />
        <KpiCard label="Expected Savings" value={formatCurrency(summary.expectedSavings)} icon={Wallet} accent="from-chart-3 to-chart-2" trend={18} delay={0.2} />
        <KpiCard label="Suggested Transfers" value={String(summary.suggestedTransfers)} icon={ListChecks} accent="from-primary to-chart-6" delay={0.25} />
      </div>

      {/* Inventory health radial + recent analysis */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Inventory Health" description="Share of SKUs at optimal stock levels" className="lg:col-span-1">
          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={healthData} startAngle={90} endAngle={90 - 360 * (summary.inventoryHealth / 100)}>
                <RadialBar dataKey="value" cornerRadius={12} fill="url(#healthGrad)" background={{ fill: 'hsl(var(--muted))' }} />
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-3))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                  </linearGradient>
                </defs>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-4xl font-extrabold gradient-text">{summary.inventoryHealth}%</p>
                <p className="mt-1 text-xs text-muted-foreground">Healthy SKUs</p>
              </div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-chart-3/10 p-2"><p className="font-bold text-chart-3">{summary.optimalCount}</p><p className="text-muted-foreground">Optimal</p></div>
            <div className="rounded-lg bg-chart-4/10 p-2"><p className="font-bold text-chart-4">{summary.lowStockCount}</p><p className="text-muted-foreground">Low</p></div>
            <div className="rounded-lg bg-chart-5/10 p-2"><p className="font-bold text-chart-5">{summary.criticalCount}</p><p className="text-muted-foreground">Critical</p></div>
          </div>
        </ChartCard>

        <ChartCard title="Stock Status Distribution" description="Across all stores & products" className="lg:col-span-2">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ResponsiveContainer width="100%" height={220} className="!w-1/2">
              <PieChart>
                <Pie data={analytics.stockStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {analytics.stockStatus.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid w-1/2 gap-2">
              {analytics.stockStatus.map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <span className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    {s.name}
                  </span>
                  <span className="text-sm font-bold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Inventory distribution + demand by store */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Inventory Distribution" description="Total units by store">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.inventoryDistribution} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={formatCompact} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatNumber(v)} />
              <Bar dataKey="value" name="Units" radius={[6, 6, 0, 0]} fill="url(#barGrad)" />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Demand by Store" description="Stock vs demand comparison">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.demandByStore} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="store" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={formatCompact} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatNumber(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="stock" name="Current Stock" radius={[6, 6, 0, 0]} fill="hsl(var(--chart-2))" />
              <Bar dataKey="demand" name="Demand" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Categories + monthly trend */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Product Categories" description="Inventory value by category">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.productCategories} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={formatCompact} />
              <YAxis type="category" dataKey="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} width={90} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="value" name="Value" radius={[0, 6, 6, 0]} fill="hsl(var(--chart-3))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Trend" description="Stock & demand over time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics.monthlyTrend} margin={{ left: -10, right: 10 }}>
              <defs>
                <linearGradient id="stockArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="demandArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={formatCompact} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="stock" name="Stock" stroke="hsl(var(--primary))" fill="url(#stockArea)" strokeWidth={2} />
              <Area type="monotone" dataKey="demand" name="Demand" stroke="hsl(var(--chart-4))" fill="url(#demandArea)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent analysis */}
      <SectionHeading title="Recent Analysis" subtitle="Latest records from the analyzed dataset" />
      <div className="overflow-hidden rounded-2xl border glass">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Store</th>
                <th className="px-4 py-3 text-left font-semibold">Product</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-right font-semibold">Stock</th>
                <th className="px-4 py-3 text-right font-semibold">Demand</th>
                <th className="px-4 py-3 text-right font-semibold">Ratio</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {analysis.rows.slice(0, 8).map((r, i) => (
                <tr key={i} className="transition-colors hover:bg-accent/40">
                  <td className="px-4 py-3 font-medium">{r.Store}</td>
                  <td className="px-4 py-3">{r.Product}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.Category}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatNumber(r.CurrentStock)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatNumber(r.Demand)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.StockRatio.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={r.Status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls = {
    'Optimal': 'bg-chart-3/15 text-chart-3',
    'Low Stock': 'bg-chart-4/15 text-chart-4',
    'Overstock': 'bg-chart-6/15 text-chart-6',
    'Critical': 'bg-chart-5/15 text-chart-5',
  }[status] ?? 'bg-muted text-muted-foreground';
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
}

const tooltipStyle = {
  background: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.75rem',
  fontSize: '12px',
  color: 'hsl(var(--popover-foreground))',
} as const;
