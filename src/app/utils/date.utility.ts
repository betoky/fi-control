import { DAILY_FORMAT, MONTHLY_FORMAT, Periodicity, WEEKLY_FORMAT, YEARLY_FORMAT } from "../models/date";

const getLastHours = (date: Date) => {
  let result = new Date(date);
  
  result.setHours(23, 59, 59, 999);

  const toDay = new Date();
  if (result > toDay) {
    result = toDay;
  }

  return result;
}

export const getStartOfWeek = (date: Date): Date => {
  const start = new Date(date);
  const day = start.getDay();
  const diffToMonday = day === 0 ? - 6 : 1 - day; // day === 0 <=> sunday, then go back to 6 days to get the day of monday
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  return start;
}

export const getDailyRange = (date: Date): [Date, Date] => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  return [start, getLastHours(date)];
}

export const getWeeklyRange = (date: Date): [Date, Date] => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return [startOfWeek, getLastHours(endOfWeek)]
}

export const getMonthlyRange = (date: Date): [Date, Date] => {
  const startOfMonth = new Date(date);
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(startOfMonth.getMonth() + 1, 0);
  return [startOfMonth, getLastHours(endOfMonth)];
}

export const getYearlyRange = (date: Date): [Date, Date] => {
  const startDay = new Date(date);
  startDay.setMonth(0, 1);
  startDay.setHours(0, 0, 0, 0);

  const endOfYear = new Date(startDay);
  endOfYear.setMonth(11, 31);
  return [startDay, getLastHours(endOfYear)];
}

const frequencyRange: Record<Periodicity, (date: Date) => [Date, Date]> = {
  daily: getDailyRange,
  weekly: getWeeklyRange,
  monthly: getMonthlyRange,
  yearly: getYearlyRange
}

export const getRangeOf = (f: Periodicity, d: Date): [Date, Date] => frequencyRange[f](d);

const dateFormatBasedOnFrequency: Record<Periodicity, string> = {
  daily: DAILY_FORMAT,
  weekly: WEEKLY_FORMAT,
  monthly: MONTHLY_FORMAT,
  yearly: YEARLY_FORMAT
}

export const getDateFormatOf = (f: Periodicity) => dateFormatBasedOnFrequency[f];
