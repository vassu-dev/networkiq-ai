import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, CheckCircle2, XCircle, Sparkles,
  Database, Table2, FileCheck2, Trash2, Download,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { parseCSV, buildFileMeta, rowsToCSV, downloadFile, REQUIRED_COLUMN_LIST } from '@/lib/csv';
import { generateSampleDataset } from '@/lib/sampleData';
import { formatBytes, formatNumber } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { SectionHeading, EmptyState } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import type { InventoryRow } from '@/types';

type Status = 'idle' | 'reading' | 'validating' | 'ready' | 'error';

export function UploadPage() {
  const { fileMeta, setDataset, loadSample, clearDataset, pushNotification } = useApp();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setStatus('reading');
    setError(null);
    setProgress(0);
    try {
      // Simulated progress while reading
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 60));
      };
      reader.onload = () => {
        setProgress(70);
        setStatus('validating');
        try {
          const text = reader.result as string;
          const { rows, columns } = parseCSV(text);
          const meta = buildFileMeta(file.name, file.size, rows, columns);
          setDataset(rows, meta);
          setProgress(100);
          setStatus('ready');
          pushNotification({
            title: 'Dataset uploaded',
            message: `${rows.length} rows across ${new Set(rows.map(r => r.Store)).size} stores ready to analyze.`,
            type: 'success',
          });
        } catch (e) {
          setStatus('error');
          setError((e as Error).message);
          pushNotification({ title: 'Upload failed', message: (e as Error).message, type: 'error' });
        }
      };
      reader.onerror = () => {
        setStatus('error');
        setError('Could not read the file.');
      };
      reader.readAsText(file);
    } catch (e) {
      setStatus('error');
      setError((e as Error).message);
    }
  }, [setDataset, pushNotification]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleLoadSample = () => {
    loadSample();
    setStatus('ready');
    setProgress(100);
    pushNotification({
      title: 'Sample dataset loaded',
      message: '60 records across 6 stores ready to analyze.',
      type: 'info',
    });
  };

  const handleDownloadTemplate = () => {
    const sample = generateSampleDataset(3);
    const headers = REQUIRED_COLUMN_LIST.join(',');
    const lines = [headers, ...sample.map((r) =>
      `${r.Store},${r.Product},${r.Category},${r.CurrentStock},${r.Demand},${r.Price},${r.HoldingCost},${r.TransferCost},${r.Location}`
    )];
    downloadFile('networkiq_template.csv', lines.join('\n'));
  };

  const handleAnalyze = () => navigate('/app/analysis');

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Upload your inventory dataset"
        subtitle="Drag and drop a CSV file, or load the built-in sample to explore the platform."
        action={
          fileMeta ? (
            <Button variant="outline" size="sm" onClick={clearDataset}>
              <Trash2 className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          ) : null
        }
      />

      {/* Required columns hint */}
      <div className="rounded-2xl border glass p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-muted-foreground">Required columns:</span>
          {REQUIRED_COLUMN_LIST.map((c) => (
            <span key={c} className="rounded-md bg-primary/10 px-2 py-1 font-mono font-medium text-primary">{c}</span>
          ))}
          <button onClick={handleDownloadTemplate} className="ml-auto inline-flex items-center gap-1 text-primary hover:underline">
            <Download className="h-3.5 w-3.5" /> Download template
          </button>
        </div>
      </div>

      {!fileMeta ? (
        <>
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            className={cn(
              'relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all',
              dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border glass hover:border-primary/40'
            )}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={onPick} />
            <motion.div
              animate={dragActive ? { y: -6 } : { y: 0 }}
              className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-chart-2 text-white shadow-xl shadow-primary/30"
            >
              <UploadCloud className="h-8 w-8" />
            </motion.div>
            <p className="mt-4 text-lg font-semibold">Drag & drop your CSV here</p>
            <p className="mt-1 text-sm text-muted-foreground">or click to browse — max file size 10 MB</p>

            {(status === 'reading' || status === 'validating') && (
              <div className="mt-6 w-full max-w-sm">
                <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>{status === 'reading' ? 'Reading file…' : 'Validating schema…'}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-chart-2"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-2.5 text-sm text-chart-5">
                <XCircle className="h-4 w-4" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>

          {/* Or sample */}
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px w-12 bg-border" /> OR <span className="h-px w-12 bg-border" />
            </div>
            <Button variant="outline" onClick={handleLoadSample}>
              <Database className="mr-2 h-4 w-4" /> Load sample dataset
            </Button>
          </div>
        </>
      ) : (
        <FilePreview />
      )}

      {/* Analyze CTA */}
      <AnimatePresence>
        {fileMeta && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 rounded-2xl border glass-strong p-6 text-center"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">Dataset ready for AI analysis</p>
              <p className="text-sm text-muted-foreground">Run the optimization engine to generate transfer recommendations.</p>
            </div>
            <Button size="lg" onClick={handleAnalyze} className="mt-1">
              <Sparkles className="mr-2 h-4 w-4" /> Analyze Now
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilePreview() {
  const { fileMeta } = useApp();
  if (!fileMeta) return null;

  const stats = [
    { label: 'File name', value: fileMeta.name, icon: FileText },
    { label: 'File size', value: formatBytes(fileMeta.size), icon: FileCheck2 },
    { label: 'Total rows', value: formatNumber(fileMeta.rows), icon: Table2 },
    { label: 'Columns', value: String(fileMeta.columns), icon: Database },
  ];

  return (
    <div className="space-y-4">
      {/* File info cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: I }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border glass p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <I className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
            </div>
            <p className="mt-1.5 truncate text-sm font-bold">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Validation status */}
      <div className="flex items-center gap-2 rounded-xl border border-chart-3/30 bg-chart-3/10 px-4 py-3 text-sm">
        <CheckCircle2 className="h-5 w-5 text-chart-3" />
        <span className="font-medium text-chart-3">Validation passed</span>
        <span className="text-muted-foreground">— all required columns detected, schema is valid.</span>
      </div>

      {/* Preview table */}
      <div className="overflow-hidden rounded-2xl border glass">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Preview — first 20 rows</p>
          <span className="text-xs text-muted-foreground">Showing {Math.min(20, fileMeta.previewRows.length)} of {fileMeta.rows}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {fileMeta.columnNames.map((c) => (
                  <th key={c} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {fileMeta.previewRows.map((r, i) => (
                <tr key={i} className="transition-colors hover:bg-accent/40">
                  <td className="px-3 py-2.5 font-medium whitespace-nowrap">{r.Store}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{r.Product}</td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{r.Category}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{r.CurrentStock}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{r.Demand}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{r.Price}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{r.HoldingCost}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{r.TransferCost}</td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{r.Location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
