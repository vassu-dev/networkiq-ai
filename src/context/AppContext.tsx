import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AnalysisResult, FileMeta, InventoryRow } from '@/types';
import { generateSampleDataset } from '@/lib/sampleData';
import { runAnalysis } from '@/lib/aiEngine';

interface AppState {
  // uploaded dataset
  dataset: InventoryRow[];
  fileMeta: FileMeta | null;
  setDataset: (rows: InventoryRow[], meta?: FileMeta) => void;
  loadSample: () => void;
  clearDataset: () => void;
  // analysis result
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  runFullAnalysis: () => void;
  setAnalysis: (a: AnalysisResult | null) => void;
  // recommendations local mutations
  updateRecStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  // theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // notifications
  notifications: AppNotification[];
  pushNotification: (n: Omit<AppNotification, 'id' | 'time'>) => void;
  dismissNotification: (id: string) => void;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
}

const AppContext = createContext<AppState | null>(null);

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('niq-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('niq-theme', theme);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [dataset, setDatasetState] = useState<InventoryRow[]>([]);
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // apply theme on mount + whenever it changes
  if (typeof document !== 'undefined') applyTheme(theme);

  const pushNotification = useCallback((n: Omit<AppNotification, 'id' | 'time'>) => {
    const note: AppNotification = {
      ...n,
      id: Math.random().toString(36).slice(2),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications((prev) => [note, ...prev].slice(0, 12));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const setDataset = useCallback((rows: InventoryRow[], meta?: FileMeta) => {
    setDatasetState(rows);
    setFileMeta(meta ?? null);
    setAnalysis(null);
  }, []);

  const loadSample = useCallback(() => {
    const rows = generateSampleDataset(60);
    setDatasetState(rows);
    setFileMeta({
      name: 'sample_inventory.csv',
      size: rows.length * 80,
      rows: rows.length,
      columns: 9,
      columnNames: ['Store','Product','Category','CurrentStock','Demand','Price','HoldingCost','TransferCost','Location'],
      previewRows: rows.slice(0, 20),
    });
    setAnalysis(null);
  }, []);

  const clearDataset = useCallback(() => {
    setDatasetState([]);
    setFileMeta(null);
    setAnalysis(null);
  }, []);

  const runFullAnalysis = useCallback(() => {
    setIsAnalyzing(true);
  }, []);

  const updateRecStatus = useCallback((id: string, status: 'Approved' | 'Rejected') => {
    setAnalysis((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        recommendations: prev.recommendations.map((r) =>
          r.id === id ? { ...r, Status: status } : r
        ),
      };
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  // Actually run analysis when flag flips on (the Analysis page triggers this)
  const executeAnalysis = useCallback((rows: InventoryRow[]) => {
    const result = runAnalysis(rows);
    setAnalysis(result);
    setIsAnalyzing(false);
    pushNotification({
      title: 'Analysis complete',
      message: `${result.recommendations.length} recommendations generated.`,
      type: 'success',
    });
  }, [pushNotification]);

  // expose execute via a side effect handled in the Analysis page using isAnalyzing
  // We attach it to the value through a small wrapper below.
  const value: AppState & { executeAnalysis: (rows: InventoryRow[]) => void } = {
    dataset, fileMeta, setDataset, loadSample, clearDataset,
    analysis, isAnalyzing, runFullAnalysis, setAnalysis, updateRecStatus,
    theme, toggleTheme,
    notifications, pushNotification, dismissNotification,
    executeAnalysis,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx as AppState & { executeAnalysis: (rows: InventoryRow[]) => void };
}
