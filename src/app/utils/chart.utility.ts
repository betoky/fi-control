import { AnnualTotal, TotalByCategory } from "../models/expense";


export function buildSummaryByCategory(data: TotalByCategory[]) {
  const labels: string[] = [];
  const totals: number[] = [];
  data.forEach(({ category, total }) => {
    labels.push(category);
    totals.push(total);
  });
  return { labels, datasets: [{ data: totals }] };
}

export function buildAnnualChart(data: AnnualTotal[]) {
  const labels: string[] = [];
  const totals: (number|null)[] = [];
  const map = new Map(data.map(item => [item.month, item.total]));
  const year = new Date(data[0].month).getFullYear();
  Array.from({ length: 12 }, (_, i) => {
    const m = `${year}-${String(i+1).padStart(2, '0')}-01`;
    labels.push(new Date(m).toLocaleString(undefined, { month: 'long' }));
    totals.push(map.get(m) ?? null);
  });
  return { labels, datasets: [{ data: totals }] };
}