import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Sparkles, BrainCircuit, PackageX, AlertTriangle,
  Network, ScrollText, CheckCircle2, Loader2, Upload,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/primitives';
import type { AnalysisStep } from '@/types';

const STEPS: AnalysisStep[] = [
  { label: 'Reading Dataset', description: 'Parsing inventory records across all stores', icon: 'FileText' },
  { label: 'Cleaning Data', description: 'Normalizing values & handling missing fields', icon: 'Sparkles' },
  { label: 'Analyzing Inventory', description: 'Classifying stock status for each SKU-store pair', icon: 'BrainCircuit' },
  { label: 'Finding Overstock', description: 'Detecting excess inventory holding cost', icon: 'PackageX' },
  { label: 'Finding Shortage', description: 'Identifying critical & low-stock products', icon: 'AlertTriangle' },
  { label: 'Generating Recommendations', description: 'Pairing transfers by savings & priority', icon: 'Network' },
  { label: 'Generating AI Summary', description: 'Writing a human-readable executive brief', icon: 'ScrollText' },
  { label: 'Complete', description: 'Optimization pipeline finished successfully', icon: 'CheckCircle2' },
];

const ICONS: Record<string, typeof FileText> = {
  FileText, Sparkles, BrainCircuit, PackageX, AlertTriangle, Network, ScrollText, CheckCircle2,
};

export function AnalysisPage() {
  const { dataset, isAnalyzing, runFullAnalysis, executeAnalysis, analysis, fileMeta } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);

  // If no dataset, show empty state
  if (dataset.length === 0) {
    return (
      <EmptyState
        icon={Upload}
        title="No dataset to analyze"
        description="Upload a CSV or load the sample dataset first, then run the AI analysis."
        action={<Button onClick={() => navigate('/app/upload')}>Go to Upload</Button>}
      />
    );
  }

  // If analysis already complete, show result state
  if (analysis && !isAnalyzing && !started) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border glass py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-chart-3 to-chart-2 text-white shadow-xl">
            <CheckCircle2 className="h-8 w-8" />
          </div>
        </motion.div>
        <h2 className="mt-5 text-xl font-bold">Analysis already complete</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your dashboard and recommendations are ready to view.</p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate('/app/dashboard')}>View Dashboard</Button>
          <Button variant="outline" onClick={() => { setStarted(true); runFullAnalysis(); }}>
            Re-run Analysis
          </Button>
        </div>
      </div>
    );
  }

  return <AnalysisRunner />;
}

function AnalysisRunner() {
  const { dataset, isAnalyzing, runFullAnalysis, executeAnalysis, pushNotification } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);

  // Start analysis on mount if not started
  useEffect(() => {
    if (!started) {
      setStarted(true);
      runFullAnalysis();
    }
  }, [started, runFullAnalysis]);

  // Step animation: advance through steps, then execute the real engine
  useEffect(() => {
    if (!isAnalyzing) return;
    if (currentStep >= STEPS.length) {
      // Execute the actual analysis then navigate
      const t = setTimeout(() => {
        executeAnalysis(dataset);
        navigate('/app/dashboard');
      }, 400);
      return () => clearTimeout(t);
    }
    const delay = currentStep === STEPS.length - 1 ? 500 : 650;
    const t = setTimeout(() => setCurrentStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [currentStep, isAnalyzing, dataset, executeAnalysis, navigate]);

  const progress = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="mx-auto max-w-2xl py-6">
      <div className="text-center">
        <motion.div
          animate={{ rotate: isAnalyzing && currentStep < STEPS.length - 1 ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-chart-2 text-white shadow-2xl shadow-primary/40"
        >
          <BrainCircuit className="h-10 w-10" />
        </motion.div>
        <h2 className="mt-5 text-2xl font-bold">Running AI Analysis</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Processing {dataset.length} records across {new Set(dataset.map(r => r.Store)).size} stores
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="mb-2 flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">{currentStep < STEPS.length ? STEPS[currentStep]?.label : 'Finishing up'}</span>
          <span className="text-primary">{progress}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-chart-2 to-chart-3"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="mt-8 space-y-2.5">
        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          const pending = i > currentStep;
          const Icon = ICONS[step.icon] ?? FileText;
          return (
            <motion.div
              key={step.label}
              initial={false}
              animate={{
                opacity: pending ? 0.5 : 1,
                scale: active ? 1.02 : 1,
              }}
              className={cnStep(active, done)}
            >
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                done ? 'bg-chart-3/15 text-chart-3' :
                active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {done ? <CheckCircle2 className="h-5 w-5" /> :
                  active ? <Loader2 className="h-5 w-5 animate-spin" /> :
                  <Icon className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              <AnimatePresence>
                {active && (
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: 'auto' }} exit={{ width: 0 }}
                    className="overflow-hidden whitespace-nowrap text-xs font-medium text-primary"
                  >
                    running…
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function cnStep(active: boolean, done: boolean) {
  return `flex items-center gap-3 rounded-xl border p-3 transition-colors ${
    active ? 'border-primary/40 bg-primary/5' : done ? 'border-chart-3/30 bg-chart-3/5' : 'border-border glass'
  }`;
}
