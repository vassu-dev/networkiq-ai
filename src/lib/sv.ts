import type { FileMeta, InventoryRow } from '@/types';

const REQUIRED_COLUMNS: (keyof InventoryRow)[] = [
  'Store', 'Product', 'Category', 'CurrentStock', 'Demand',
  'Price', 'HoldingCost', 'TransferCost', 'Location',
];

export const REQUIRED_COLUMN_LIST = REQUIRED_COLUMNS;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = false;
      } else current += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { result.push(current.trim()); current = ''; }
      else current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeKey(k: string): string {
  return k.replace(/\s+/g, '').replace(/[_-]/g, '').toLowerCase();
}

const KEY_MAP: Record<string, keyof InventoryRow> = {
  store: 'Store', product: 'Product', category: 'Category',
  currentstock: 'CurrentStock', stock: 'CurrentStock', demand: 'Demand',
  price: 'Price', holdingcost: 'HoldingCost', transfercost: 'TransferCost',
  location: 'Location',
};

export function parseCSV(text: string): { rows: InventoryRow[]; columns: string[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new Error('CSV appears to be empty or has no data rows.');

  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  const norm = headers.map(normalizeKey);
  const colIndex: Partial<Record<keyof InventoryRow, number>> = {};
  norm.forEach((k, i) => {
    const mapped = KEY_MAP[k];
    if (mapped && colIndex[mapped] === undefined) colIndex[mapped] = i;
  });

  const missing = REQUIRED_COLUMNS.filter((c) => colIndex[c] === undefined);
  if (missing.length > 0) {
    throw new Error(`Missing required columns: ${missing.join(', ')}. Expected: ${REQUIRED_COLUMNS.join(', ')}`);
  }

  const rows: InventoryRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    const num = (idx: number | undefined) => {
      if (idx === undefined) return 0;
      const v = parseFloat(cells[idx]?.replace(/[^0-9.\-]/g, '') ?? '0');
      return isNaN(v) ? 0 : v;
    };
    rows.push({
      Store: cells[colIndex.Store!] ?? '',
      Product: cells[colIndex.Product!] ?? '',
      Category: cells[colIndex.Category!] ?? 'Uncategorized',
      CurrentStock: num(colIndex.CurrentStock),
      Demand: num(colIndex.Demand),
      Price: num(colIndex.Price),
      HoldingCost: num(colIndex.HoldingCost),
      TransferCost: num(colIndex.TransferCost),
      Location: cells[colIndex.Location!] ?? '',
    });
  }
  return { rows, columns: headers };
}

export function buildFileMeta(name: string, size: number, rows: InventoryRow[], columns: string[]): FileMeta {
  return {
    name,
    size,
    rows: rows.length,
    columns: columns.length,
    columnNames: columns,
    previewRows: rows.slice(0, 20),
  };
}

export function rowsToCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map((h) => escape(r[h])).join(','));
  return lines.join('\n');
}

export function downloadFile(filename: string, content: string, mime = 'text/csv') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
