import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Package, Store, MapPin, ArrowRight, TrendingUp, AlertTriangle, PackageX, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/primitives';
import { formatNumber, formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export function ProductSearch() {
  const { analysis } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const products = useMemo(() => {
    if (!analysis) return [];
    return [...new Set(analysis.rows.map((r) => r.Product))].sort();
  }, [analysis]);

  const matches = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return products.filter((p) => p.toLowerCase().includes(q)).slice(0, 8);
  }, [query, products]);

  const productRows = useMemo(() => {
    if (!analysis || !selectedProduct) return [];
    return analysis.rows.filter((r) => r.Product === selectedProduct);
  }, [analysis, selectedProduct]);

  const productRecommendations = useMemo(() => {
    if (!analysis || !selectedProduct) return [];
    return analysis.recommendations.filter((r) => r.Product === selectedProduct);
  }, [analysis, selectedProduct]);

  if (!analysis) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Search unavailable"
        description="Run the AI analysis first to search across products, stock levels, and recommendations."
        action={<Button onClick={() => navigate('/app/analysis')}>Run Analysis</Button>}
      />
    );
  }

  const handleSearch = (q?: string) => {
    const term = q ?? query;
    if (products.find((p) => p.toLowerCase() === term.toLowerCase())) {
      setSelectedProduct(term);
      setQuery('');
    } else if (matches.length > 0) {
      setSelectedProduct(matches[0]);
      setQuery('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative mx-auto max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for a product — e.g. Rice, Milk, Detergent…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="h-12 pl-12 text-base"
        />
        <AnimatePresence>
          {matches.length > 0 && query && !selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border glass-strong shadow-2xl"
            >
              {matches.map((p) => (
                <button
                  key={p}
                  onClick={() => { setSelectedProduct(p); setQuery(''); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent"
                >
                  <Package className="h-4 w-4 text-primary" /> {p}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {products.slice(0, 12).map((p) => (
          <button
            key={p}
            onClick={() => setSelectedProduct(p)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              selectedProduct === p ? 'border-primary bg-primary/10 text-primary' : 'glass text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Results */}
      {selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          rows={productRows}
          recs={productRecommendations}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-muted-foreground">
            <Search className="h-8 w-8" />
          </div>
          <p className="mt-4 font-semibold">Search for any product</p>
          <p className="mt-1 text-sm text-muted-foreground">See current stock, demand, status, and AI recommendations per store.</p>
        </div>
      )}
    </div>
  );
}

import type { AnalyzedRow, Recommendation } from '@/types';

const STATUS_STYLE: Record<string, { cls: string; icon: typeof CheckCircle2 }> = {
  'Optimal': { cls: 'text-chart-3', icon: CheckCircle2 },
  'Low Stock': { cls: 'text-chart-4', icon: AlertTriangle },
  'Critical': { cls: 'text-chart-5', icon: AlertTriangle },
  'Overstock': { cls: 'text-chart-6', icon: PackageX },
};

function ProductDetail({ product, rows, recs }: { product: string; rows: AnalyzedRow[]; recs: Recommendation[] }) {
  const totalStock = rows.reduce((a, r) => a + r.CurrentStock, 0);
  const totalDemand = rows.reduce((a, r) => a + r.Demand, 0);
  const category = rows[0]?.Category ?? '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border glass p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-white shadow-lg">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{product}</h2>
            <p className="text-sm text-muted-foreground">Category: {category}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-muted/40 p-3"><p className="text-xs text-muted-foreground">Stores</p><p className="text-lg font-bold">{rows.length}</p></div>
          <div className="rounded-xl bg-muted/40 p-3"><p className="text-xs text-muted-foreground">Total Stock</p><p className="text-lg font-bold">{formatNumber(totalStock)}</p></div>
          <div className="rounded-xl bg-muted/40 p-3"><p className="text-xs text-muted-foreground">Total Demand</p><p className="text-lg font-bold">{formatNumber(totalDemand)}</p></div>
        </div>
      </div>

      {/* Per-store breakdown */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r, i) => {
          const st = STATUS_STYLE[r.Status] ?? STATUS_STYLE['Optimal'];
          const Icon = st.icon;
          const rec = recs.find((x) => x.StoreFrom === r.Store || x.StoreTo === r.Store);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border glass p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Store className="h-4 w-4 text-primary" /> {r.Store}
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {r.Location}
                  </p>
                </div>
                <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-muted/50', st.cls)}>
                  <Icon className="h-3.5 w-3.5" /> {r.Status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <p className="text-xs text-muted-foreground">Current Stock</p>
                  <p className="font-bold">{formatNumber(r.CurrentStock)}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <p className="text-xs text-muted-foreground">Demand</p>
                  <p className="font-bold">{formatNumber(r.Demand)}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <p className="text-xs text-muted-foreground">Predicted Demand</p>
                  <p className="font-bold text-primary">{formatNumber(r.PredictedDemand)}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <p className="text-xs text-muted-foreground">Revenue Risk</p>
                  <p className="font-bold text-chart-5">{formatCurrency(r.RevenueRisk)}</p>
                </div>
              </div>
              {/* Ratio bar */}
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Stock vs Demand</span><span>{r.StockRatio.toFixed(2)}×</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full', r.Status === 'Critical' || r.Status === 'Low Stock' ? 'bg-chart-5' : r.Status === 'Overstock' ? 'bg-chart-6' : 'bg-chart-3')}
                    style={{ width: `${Math.min(100, r.StockRatio * 50)}%` }}
                  />
                </div>
              </div>
              {/* Recommendation */}
              {rec && (
                <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-xs">
                  <p className="flex items-center gap-1.5 font-semibold text-primary">
                    <TrendingUp className="h-3.5 w-3.5" /> AI Recommendation
                  </p>
                  <p className="mt-1 leading-relaxed">
                    {rec.StoreFrom === r.Store
                      ? `Transfer ${rec.TransferQuantity} units to ${rec.StoreTo} — save ${formatCurrency(rec.EstimatedSavings)}.`
                      : `Receive ${rec.TransferQuantity} units from ${rec.StoreFrom} — prevent shortage.`}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
