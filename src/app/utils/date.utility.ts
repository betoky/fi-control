export function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = day === 0 ? - 6 : 1 - day;
  const mondayOfWeek = new Date(date.setDate(date.getDate() + diff));
  mondayOfWeek.setHours(0, 0, 0, 0);

  return mondayOfWeek;
}