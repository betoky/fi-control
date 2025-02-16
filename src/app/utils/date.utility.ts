import { Periodicity } from "../models/date";

export function getStartOfWeek(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();
  const diffToMonday = day === 0 ? - 6 : 1 - day; // day === 0 <=> sunday, then go back to 6 days to get the day of monday
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  return start;
}

export function getDailyRange(date: Date): [Date, Date] {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return [start, end];
}

export function getWeeklyRange(date: Date): [Date, Date] {
  const start = getStartOfWeek(date);
  let end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const toDay = new Date();
  if (end > toDay) {
    end = toDay;
  }
  return [start, end]
}

export function getMonthlyRange(date: Date): [Date, Date] {
  const start = new Date(date);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  let end = new Date(start);
  end.setMonth(start.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  const today = new Date();
  if (end > today) {
    end = today;
  }
  return [start, end];
}

export function getYearlyRange(date: Date): [Date, Date] {
  const start = new Date(date);
  start.setMonth(0, 1);
  start.setHours(0, 0, 0, 0);

  let end = new Date(start);
  end.setMonth(11, 31);
  end.setHours(23, 59, 59, 999);

  const today = new Date();
  if (end > today) {
    end = today;
  }
  return [start, end];
}

const frequencyRange: Record<Periodicity, (date: Date) => [Date, Date]> = {
  daily: getDailyRange,
  weekly: getWeeklyRange,
  monthly: getMonthlyRange,
  yearly: getYearlyRange
}

export function getRangeOf(frequency: Periodicity, date: Date): [Date, Date] {
  return frequencyRange[frequency](date);
}
