export function getStartOfWeek(date: Date): Date {
  const clone = new Date(date);
  const day = clone.getDay();
  const diff = day === 0 ? - 6 : 1 - day;
  const mondayOfWeek = new Date(clone.setDate(clone.getDate() + diff));
  mondayOfWeek.setHours(0, 0, 0, 0);

  return mondayOfWeek;
}

export function addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}