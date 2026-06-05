import { Database } from "../../../database.types";
import { Periodicity } from "../models/date";

type Functions = Database['public']['Functions'];

const frequencyRange: Record<Periodicity, keyof Functions> = {
  daily: 'daily_summary',
  weekly: 'weekly_summary',
  monthly: 'monthly_summary',
  yearly: 'annual_summary',
}

export const rpcSummaryOf = (frequency: Periodicity): keyof Functions => {
  return frequencyRange[frequency];
}