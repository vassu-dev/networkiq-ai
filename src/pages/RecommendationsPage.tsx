import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowUpDown, Check, X, ChevronLeft, ChevronRight,
  Sparkles, Download, Filter, ArrowRight, Wallet, TrendingUp,
  CheckCircle2, XCircle, Clock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState, KpiCard } from '@/components/ui/primitives';
import { rowsToCSV, downloadFile } from '@/lib/csv';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Priority, Recommendation } from '@/types';

type SortKey = 'EstimatedSavings' | 'ExpectedProfit' | 'TransferQuantity' | 'TransferCost' | 'Priority';
const PAGE_SIZE = 8;

const PRIORITY_RANK: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };

export function RecommendationsPage() {
  const { analysis, updateRecStatus, pushNotification } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('EstimatedSavings');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const recs = analysis?.recommendations ?? [];

  const filtered = useMemo(() => {
    let list = recs.filter((r) => {
      if (priorityFilter !== 'all' && r.Priority !== priorityFilter) return false;
      if (statusFilter !== 'all' && r.Status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.Product.toLowerCase().includes(q) &&
            !r.StoreFrom.toLowerCase().includes(q) &&
            !r.StoreTo.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      let cmp: number;
      if (sortKey === 'Priority') cmp = PRIORITY_RANK[a.Priority] - PRIORITY_RANK[b.Priority];
      else cmp = a[sortKey] - b[sortKey];
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [recs, search, priorityFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRecs = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const handleApprove = (r: Recommendation) => {
    updateRecStatus(r.id, 'Approved');
    pushNotification({ title: 'Transfer approved', message: `${r.Product}: ${r.StoreFrom} → ${r.StoreTo}`, type: 'success' });
  };
  const handleReject = (r: Recommendation) => {
    updateRecStatus(r.id, 'Rejected');
    pushNotification({ title: 'Transfer rejected', message: `${r.Product}: ${r.StoreFrom} → ${r.StoreTo}`, type: 'warning' });
  };

  const handleExport = () => {
    const csv = rowsToCSV(filtered.map((r) => ({ ...r })));
    downloadFile(`networkiq_recommendations_${Date.now()}.csv`, csv);
  };

  if (!analysis) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No recommendations yet"
        description="Run the AI analysis on your dataset to generate transfer recommendations."
        action={<Button onClick={() => navigate('/app/analysis')}>Run Analysis</Button>}
      />
    );
  }

  if (recs.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="Inventory is balanced"
        description="The AI engine found no overstock-to-shortage transfer opportunities in the current dataset."
      />
    );
  }

  const approved = recs.filter((r) => r.Status === 'Approved').length;
  const rejected = recs.filter((r) => r.Status === 'Rejected').length;
  const pending = recs.filter((r) => r.Status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Recommendations" value={String(recs.length)} icon={Sparkles} accent="from-primary to-chart-2" delay={0} />
        <KpiCard label="Pending" value={String(pending)} icon={Clock} accent="from-chart-4 to-chart-5" delay={0.05} />
        <KpiCard label="Approved" value={String(approved)} icon={CheckCircle2} accent="from-chart-3 to-chart-2" delay={0.1} />
        <KpiCard label="Total Savings" value={formatCurrency(recs.reduce((a, r) => a + r.EstimatedSavings, 0))} icon={Wallet} accent="from-chart-2 to-chart-3" delay={0.15} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border glass p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search product, store…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[130px]"><Filter className="mr-1.5 h-3.5 w-3.5" /><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleExport} title="Export CSV">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Showing {pageRecs.length} of {filtered.length} recommendations</p>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border glass">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left font-semibold">Product</th>
                <th className="px-3 py-3 text-left font-semibold">From → To</th>
                <SortHeader label="Qty" k="TransferQuantity" cur={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Priority" k="Priority" cur={sortKey} dir={sortDir} onSort={handleSort} center />
                <SortHeader label="Cost" k="TransferCost" cur={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Savings" k="EstimatedSavings" cur={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Profit" k="ExpectedProfit" cur={sortKey} dir={sortDir} onSort={handleSort} />
                <th className="px-3 py-3 text-center font-semibold">Status</th>
                <th className="px-3 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageRecs.map((r) => (
                <RecRow key={r.id} rec={r} expanded={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} onApprove={() => handleApprove(r)} onReject={() => handleReject(r)} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SortHeader({ label, k, cur, dir, onSort, center }: { label: string; k: SortKey; cur: SortKey; dir: 'asc' | 'desc'; onSort: (k: SortKey) => void; center?: boolean }) {
  const active = cur === k;
  return (
    <th className={`px-3 py-3 ${center ? 'text-center' : 'text-right'} font-semibold`}>
      <button
        onClick={() => onSort(k)}
        className={cn('inline-flex items-center gap-1 transition-colors hover:text-foreground', active && 'text-primary')}
      >
        {label}
        <ArrowUpDown className={`h-3 w-3 ${active ? 'opacity-100' : 'opacity-40'} ${active && dir === 'asc' ? 'rotate-180' : ''}`} />
      </button>
    </th>
  );
}

function RecRow({ rec, expanded, onToggle, onApprove, onReject }: {
  rec: Recommendation; expanded: boolean; onToggle: () => void; onApprove: () => void; onReject: () => void;
}) {
  const priorityCls = { High: 'bg-chart-5/15 text-chart-5', Medium: 'bg-chart-4/15 text-chart-4', Low: 'bg-chart-3/15 text-chart-3' }[rec.Priority];
  const statusCls = {
    Pending: 'bg-muted text-muted-foreground',
    Approved: 'bg-chart-3/15 text-chart-3',
    Rejected: 'bg-chart-5/15 text-chart-5',
  }[rec.Status];

  return (
    <>
      <tr className="cursor-pointer transition-colors hover:bg-accent/40" onClick={onToggle}>
        <td className="px-3 py-3">
          <p className="font-medium">{rec.Product}</p>
          <p className="text-xs text-muted-foreground">{rec.Category}</p>
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-medium">{rec.StoreFrom}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{rec.StoreTo}</span>
          </div>
        </td>
        <td className="px-3 py-3 text-right tabular-nums font-medium">{formatNumber(rec.TransferQuantity)}</td>
        <td className="px-3 py-3 text-center"><span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${priorityCls}`}>{rec.Priority}</span></td>
        <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{formatCurrency(rec.TransferCost)}</td>
        <td className="px-3 py-3 text-right tabular-nums font-bold text-chart-3">{formatCurrency(rec.EstimatedSavings)}</td>
        <td className="px-3 py-3 text-right tabular-nums font-semibold text-primary">{formatCurrency(rec.ExpectedProfit)}</td>
        <td className="px-3 py-3 text-center"><span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusCls}`}>{rec.Status}</span></td>
        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center gap-1">
            <button onClick={onApprove} disabled={rec.Status !== 'Pending'} className="grid h-7 w-7 place-items-center rounded-md bg-chart-3/15 text-chart-3 transition-colors hover:bg-chart-3/25 disabled:opacity-30" title="Approve">
              <Check className="h-4 w-4" />
            </button>
            <button onClick={onReject} disabled={rec.Status !== 'Pending'} className="grid h-7 w-7 place-items-center rounded-md bg-chart-5/15 text-chart-5 transition-colors hover:bg-chart-5/25 disabled:opacity-30" title="Reject">
              <X className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-accent/30"
          >
            <td colSpan={9} className="px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Explanation</p>
                  <p className="mt-1 text-sm leading-relaxed">{rec.Reason}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                    <div><span className="text-muted-foreground">Transfer ID</span><p className="font-semibold">{rec.id}</p></div>
                    <div><span className="text-muted-foreground">Transfer cost</span><p className="font-semibold">{formatCurrency(rec.TransferCost)}</p></div>
                    <div><span className="text-muted-foreground">Est. savings</span><p className="font-semibold text-chart-3">{formatCurrency(rec.EstimatedSavings)}</p></div>
                    <div><span className="text-muted-foreground">Expected profit</span><p className="font-semibold text-primary">{formatCurrency(rec.ExpectedProfit)}</p></div>
                  </div>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}
