import { AnnualTotal, TotalByCategory } from "../models/expense";


export function buildSummaryByCategory(data: TotalByCategory[]) {
  if (data.length === 0) return { labels: [], datasets: [] }
  
  const labels: string[] = [];
  const totals: number[] = [];
  data.forEach(({ category, total }) => {
    labels.push(category);
    totals.push(total);
  });
  return { labels, datasets: [{ data: totals }] };
}

export function buildAnnualChart(data: AnnualTotal[]) {
  if (data.length === 0) return { labels: [], datasets: [] }

  const labels: string[] = [];
  const totals: (number|null)[] = [];
  const map = new Map(data.map(item => [item.month, item.total]));
  const year = new Date(data[0].month).getFullYear();
  Array.from({ length: 12 }, (_, i) => {
    const m = `${year}-${String(i+1).padStart(2, '0')}-01`;
    const label = new Date(m).toLocaleString(undefined, { month: 'short' });
    labels.push(label.charAt(0).toUpperCase() + label.slice(1));
    totals.push(map.get(m) ?? null);
  });
  return { labels, datasets: [{ label: year, data: totals }] };
}