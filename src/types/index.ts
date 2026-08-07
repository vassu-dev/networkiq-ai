// ===== Core domain types for NetworkIQ =====

export interface InventoryRow {
  Store: string;
  Product: string;
  Category: string;
  CurrentStock: number;
  Demand: number;
  Price: number;
  HoldingCost: number;
  TransferCost: number;
  Location: string;
}

// Row enriched with derived analytical fields
export interface AnalyzedRow extends InventoryRow {
  StockRatio: number;       // CurrentStock / Demand
  Status: StockStatus;
  Shortage: number;         // Demand - CurrentStock (when positive)
  Excess: number;           // CurrentStock - Demand (when positive)
  PredictedDemand: number;  // AI-predicted next-period demand
  HoldingValue: number;     // Excess * HoldingCost
  RevenueRisk: number;      // Shortage * Price
}

export type StockStatus = 'Overstock' | 'Low Stock' | 'Optimal' | 'Critical';

export type Priority = 'High' | 'Medium' | 'Low';

export interface Recommendation {
  id: string;
  Product: string;
  Category: string;
  StoreFrom: string;
  StoreTo: string;
  TransferQuantity: number;
  Priority: Priority;
  TransferCost: number;
  EstimatedSavings: number;
  ExpectedProfit: number;
  Reason: string;
  Status: 'Pending' | 'Approved' | 'Rejected';
}

export interface DashboardSummary {
  totalProducts: number;
  totalStores: number;
  totalUnits: number;
  inventoryValue: number;
  lowStockCount: number;
  criticalCount: number;
  overstockCount: number;
  optimalCount: number;
  expectedSavings: number;
  suggestedTransfers: number;
  inventoryHealth: number;
  totalShortage: number;
  totalExcess: number;
}

export interface AnalyticsData {
  inventoryDistribution: { name: string; value: number; units: number }[];
  demandByStore: { store: string; demand: number; stock: number }[];
  productCategories: { category: string; count: number; stock: number; value: number }[];
  stockStatus: { name: StockStatus; value: number; color: string }[];
  monthlyTrend: { month: string; stock: number; demand: number; transfers: number }[];
  topProducts: { product: string; store: string; demand: number; stock: number }[];
  worstProducts: { product: string; store: string; demand: number; stock: number; shortage: number }[];
  storeComparison: { store: string; stock: number; demand: number; health: number }[];
  demandForecast: { period: string; actual: number | null; predicted: number; lower: number; upper: number }[];
  heatmap: { store: string; product: string; stock: number; demand: number; ratio: number }[];
}

export interface AnalysisResult {
  summary: DashboardSummary;
  rows: AnalyzedRow[];
  recommendations: Recommendation[];
  analytics: AnalyticsData;
  aiSummary: string;
  generatedAt: string;
}

export interface AnalysisStep {
  label: string;
  description: string;
  icon: string;
}

export interface FileMeta {
  name: string;
  size: number;
  rows: number;
  columns: number;
  columnNames: string[];
  previewRows: InventoryRow[];
}
