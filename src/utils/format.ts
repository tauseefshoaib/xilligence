export function formatPercent(value: number | string | null | undefined, digits = 2): string {
  const num = Number(value);
  if (Number.isNaN(num)) return '--';
  return `${num.toFixed(digits)}%`;
}

export function formatCurrencyINR(value: number | string | null | undefined): string {
  const num = Number(value);
  if (Number.isNaN(num)) return '--';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

export function formatCr(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '--';
  return String(value);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
