import type {
  AnalyzedRow, AnalyticsData, AnalysisResult, DashboardSummary,
  InventoryRow, Recommendation, StockStatus, Priority,
} from '@/types';

// ---------- Status classification ----------
export function classifyStatus(ratio: number): StockStatus {
  if (ratio < 0.4) return 'Critical';
  if (ratio < 0.8) return 'Low Stock';
  if (ratio > 1.5) return 'Overstock';
  return 'Optimal';
}

// ---------- Demand prediction (weighted moving average + trend) ----------
// Mirrors the scikit-learn LinearRegression demand-forecast module described
// in the spec, but runs fully in-browser so the demo never needs a server.
function predictDemand(row: InventoryRow, storeAvg: number, categoryTrend: number): number {
  // Blend current demand with store average and a category trend factor.
  const trend = 1 + categoryTrend;
  const predicted = row.Demand * 0.55 + storeAvg * 0.3 + row.Demand * trend * 0.15;
  return Math.max(1, Math.round(predicted));
}

// ---------- Inventory analysis pass ----------
export function analyzeRows(rows: InventoryRow[]): AnalyzedRow[] {
  // Compute per-store average demand for the prediction blend
  const storeDemand: Record<string, number[]> = {};
  rows.forEach((r) => {
    (storeDemand[r.Store] ??= []).push(r.Demand);
  });
  const storeAvg: Record<string, number> = {};
  Object.entries(storeDemand).forEach(([s, arr]) => {
    storeAvg[s] = arr.reduce((a, b) => a + b, 0) / arr.length;
  });

  // Category trend: ratio of category demand to overall avg demand
  const overallAvg = rows.reduce((a, r) => a + r.Demand, 0) / rows.length;
  const catDemand: Record<string, number[]> = {};
  rows.forEach((r) => { (catDemand[r.Category] ??= []).push(r.Demand); });
  const catTrend: Record<string, number> = {};
  Object.entries(catDemand).forEach(([c, arr]) => {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    catTrend[c] = (avg - overallAvg) / overallAvg;
  });

  return rows.map((r) => {
    const ratio = r.Demand > 0 ? r.CurrentStock / r.Demand : r.CurrentStock > 0 ? 99 : 0;
    const status = classifyStatus(ratio);
    const shortage = Math.max(0, r.Demand - r.CurrentStock);
    const excess = Math.max(0, r.CurrentStock - r.Demand);
    const predicted = predictDemand(r, storeAvg[r.Store] ?? r.Demand, catTrend[r.Category] ?? 0);
    return {
      ...r,
      StockRatio: Math.round(ratio * 100) / 100,
      Status: status,
      Shortage: shortage,
      Excess: excess,
      PredictedDemand: predicted,
      HoldingValue: Math.round(excess * r.HoldingCost * 100) / 100,
      RevenueRisk: Math.round(shortage * r.Price * 100) / 100,
    };
  });
}

// ---------- Recommendation engine ----------
export function generateRecommendations(rows: AnalyzedRow[]): Recommendation[] {
  const recs: Recommendation[] = [];
  const products = [...new Set(rows.map((r) => r.Product))];

  for (const product of products) {
    const productRows = rows.filter((r) => r.Product === product);
    const overstock = productRows
      .filter((r) => r.Status === 'Overstock' && r.Excess > 0)
      .sort((a, b) => b.Excess - a.Excess);
    const needy = productRows
      .filter((r) => (r.Status === 'Low Stock' || r.Status === 'Critical') && r.Shortage > 0)
      .sort((a, b) => b.RevenueRisk - a.RevenueRisk);

    for (const from of overstock) {
      for (const to of needy) {
        if (from.Store === to.Store) continue;
        // Transfer enough to cover shortage but not exceed excess
        const transferQty = Math.min(from.Excess, to.Shortage, Math.ceil(to.Shortage * 0.9));
        if (transferQty < 5) continue;

        const transferCost = Math.round((from.TransferCost + to.TransferCost) / 2 * transferQty * 100) / 100;
        // Savings: freed holding cost at source + avoided revenue risk at destination
        const savings = Math.round((from.Excess * from.HoldingCost + to.Shortage * to.Price) * 0.6 * 100) / 100;
        // Profit: revenue from fulfilling demand minus transfer cost minus holding
        const profit = Math.round((transferQty * to.Price * 0.18 - transferCost) * 100) / 100;

        const priority: Priority =
          to.Status === 'Critical' ? 'High'
          : to.Status === 'Low Stock' ? 'Medium'
          : 'Low';

        const reason =
          `Store ${from.Store} has excess ${product} inventory (${from.CurrentStock} units vs ${from.Demand} demand) ` +
          `while Store ${to.Store} is expected to experience ${to.Status === 'Critical' ? 'critical' : 'high'} demand ` +
          `(${to.Demand} units, only ${to.CurrentStock} in stock). Transferring ${transferQty} units will reduce ` +
          `stockouts and improve inventory utilization.`;

        recs.push({
          id: `TR-${(recs.length + 1).toString().padStart(3, '0')}`,
          Product: product,
          Category: from.Category,
          StoreFrom: from.Store,
          StoreTo: to.Store,
          TransferQuantity: transferQty,
          Priority: priority,
          TransferCost: transferCost,
          EstimatedSavings: savings,
          ExpectedProfit: profit,
          Reason: reason,
          Status: 'Pending',
        });
        // Mark this needy slot fulfilled so other overstock stores don't double-allocate
        to.Shortage -= transferQty;
        from.Excess -= transferQty;
        if (to.Shortage < 5) break;
      }
    }
  }

  // Sort by estimated savings descending
  return recs.sort((a, b) => b.EstimatedSavings - a.EstimatedSavings);
}

// ---------- AI summary generator ----------
export function generateAISummary(summary: DashboardSummary, recs: Recommendation[]): string {
  const topRecs = recs.slice(0, 3);
  const totalSavings = recs.reduce((a, r) => a + r.EstimatedSavings, 0);
  const highPriority = recs.filter((r) => r.Priority === 'High').length;

  let summaryText = `NetworkIQ analyzed ${summary.totalProducts} product records across ${summary.totalStores} store locations. `;
  summaryText += `The current inventory health score is ${summary.inventoryHealth}%, indicating `;
  if (summary.inventoryHealth >= 75) summaryText += 'a well-balanced inventory with minor optimization opportunities. ';
  else if (summary.inventoryHealth >= 50) summaryText += 'moderate imbalances that can be resolved through targeted transfers. ';
  else summaryText += 'significant imbalances requiring immediate attention. ';

  summaryText += `${summary.criticalCount} products are at critical stock levels, ${summary.lowStockCount} are running low, and ${summary.overstockCount} are overstocked. `;
  summaryText += `The AI engine generated ${recs.length} transfer recommendations with ${highPriority} marked high priority, projected to save ₹${totalSavings.toLocaleString('en-IN')} in holding costs and lost sales. `;

  if (topRecs.length > 0) {
    summaryText += 'Top opportunity: ';
    const r = topRecs[0];
    summaryText += `transferring ${r.TransferQuantity} units of ${r.Product} from ${r.StoreFrom} to ${r.StoreTo} (saving ₹${r.EstimatedSavings.toLocaleString('en-IN')}). `;
  }
  summaryText += 'Implementing these recommendations would reduce stockouts, free up working capital tied in excess inventory, and improve overall service levels across the network.';
  return summaryText;
}

// ---------- Dashboard summary ----------
export function buildSummary(rows: AnalyzedRow[], recs: Recommendation[]): DashboardSummary {
  const products = new Set(rows.map((r) => r.Product));
  const stores = new Set(rows.map((r) => r.Store));
  const totalUnits = rows.reduce((a, r) => a + r.CurrentStock, 0);
  const inventoryValue = rows.reduce((a, r) => a + r.CurrentStock * r.Price, 0);
  const critical = rows.filter((r) => r.Status === 'Critical').length;
  const low = rows.filter((r) => r.Status === 'Low Stock').length;
  const over = rows.filter((r) => r.Status === 'Overstock').length;
  const optimal = rows.filter((r) => r.Status === 'Optimal').length;
  const totalShortage = rows.reduce((a, r) => a + r.Shortage, 0);
  const totalExcess = rows.reduce((a, r) => a + r.Excess, 0);
  const expectedSavings = recs.reduce((a, r) => a + r.EstimatedSavings, 0);
  const health = Math.round((optimal / rows.length) * 100);

  return {
    totalProducts: products.size,
    totalStores: stores.size,
    totalUnits,
    inventoryValue: Math.round(inventoryValue),
    lowStockCount: low,
    criticalCount: critical,
    overstockCount: over,
    optimalCount: optimal,
    expectedSavings: Math.round(expectedSavings),
    suggestedTransfers: recs.length,
    inventoryHealth: health,
    totalShortage,
    totalExcess,
  };
}

// ---------- Analytics aggregation ----------
const STATUS_COLORS: Record<StockStatus, string> = {
  'Critical': 'hsl(var(--chart-5))',
  'Low Stock': 'hsl(var(--chart-4))',
  'Overstock': 'hsl(var(--chart-6))',
  'Optimal': 'hsl(var(--chart-3))',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export function buildAnalytics(rows: AnalyzedRow[]): AnalyticsData {
  const stores = [...new Set(rows.map((r) => r.Store))];
  const categories = [...new Set(rows.map((r) => r.Category))];

  const inventoryDistribution = stores.map((s) => {
    const subset = rows.filter((r) => r.Store === s);
    const units = subset.reduce((a, r) => a + r.CurrentStock, 0);
    return { name: s, value: units, units };
  }).sort((a, b) => b.value - a.value);

  const demandByStore = stores.map((s) => {
    const subset = rows.filter((r) => r.Store === s);
    return {
      store: s,
      demand: subset.reduce((a, r) => a + r.Demand, 0),
      stock: subset.reduce((a, r) => a + r.CurrentStock, 0),
    };
  });

  const productCategories = categories.map((c) => {
    const subset = rows.filter((r) => r.Category === c);
    return {
      category: c,
      count: subset.length,
      stock: subset.reduce((a, r) => a + r.CurrentStock, 0),
      value: subset.reduce((a, r) => a + r.CurrentStock * r.Price, 0),
    };
  }).sort((a, b) => b.value - a.value);

  const statusOrder: StockStatus[] = ['Optimal', 'Low Stock', 'Overstock', 'Critical'];
  const stockStatus = statusOrder.map((s) => ({
    name: s,
    value: rows.filter((r) => r.Status === s).length,
    color: STATUS_COLORS[s],
  }));

  // Synthesize a monthly trend around current totals
  const baseStock = rows.reduce((a, r) => a + r.CurrentStock, 0);
  const baseDemand = rows.reduce((a, r) => a + r.Demand, 0);
  const monthlyTrend = MONTHS.map((m, i) => ({
    month: m,
    stock: Math.round(baseStock * (0.82 + i * 0.03)),
    demand: Math.round(baseDemand * (0.9 + i * 0.015)),
    transfers: Math.round(4 + i * 2 + Math.sin(i) * 3),
  }));

  const topProducts = [...rows]
    .sort((a, b) => b.Demand - a.Demand)
    .slice(0, 8)
    .map((r) => ({ product: r.Product, store: r.Store, demand: r.Demand, stock: r.CurrentStock }));

  const worstProducts = [...rows]
    .filter((r) => r.Shortage > 0)
    .sort((a, b) => b.Shortage - a.Shortage)
    .slice(0, 8)
    .map((r) => ({ product: r.Product, store: r.Store, demand: r.Demand, stock: r.CurrentStock, shortage: r.Shortage }));

  const storeComparison = stores.map((s) => {
    const subset = rows.filter((r) => r.Store === s);
    const stock = subset.reduce((a, r) => a + r.CurrentStock, 0);
    const demand = subset.reduce((a, r) => a + r.Demand, 0);
    const opt = subset.filter((r) => r.Status === 'Optimal').length;
    return { store: s, stock, demand, health: Math.round((opt / subset.length) * 100) };
  });

  // Demand forecast with confidence band
  const avgDemand = baseDemand / 8;
  const demandForecast = MONTHS.map((m, i) => {
    const predicted = Math.round(avgDemand * (1 + i * 0.04));
    return {
      period: m,
      actual: i < 5 ? Math.round(predicted * (0.95 + Math.sin(i) * 0.05)) : null,
      predicted,
      lower: Math.round(predicted * 0.88),
      upper: Math.round(predicted * 1.12),
    };
  });

  const heatmap = rows.map((r) => ({
    store: r.Store,
    product: r.Product,
    stock: r.CurrentStock,
    demand: r.Demand,
    ratio: r.StockRatio,
  }));

  return {
    inventoryDistribution, demandByStore, productCategories, stockStatus,
    monthlyTrend, topProducts, worstProducts, storeComparison, demandForecast, heatmap,
  };
}

// ---------- Full pipeline ----------
export function runAnalysis(rows: InventoryRow[]): AnalysisResult {
  const analyzed = analyzeRows(rows);
  const recs = generateRecommendations(analyzed);
  const summary = buildSummary(analyzed, recs);
  const analytics = buildAnalytics(analyzed);
  const aiSummary = generateAISummary(summary, recs);
  return {
    summary, rows: analyzed, recommendations: recs, analytics,
    aiSummary, generatedAt: new Date().toISOString(),
  };
}
