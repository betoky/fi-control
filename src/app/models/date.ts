export type Periodicity = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function isPeriodictyType(value: string): value is Periodicity {
  return ['daily', 'weekly', 'monthly', 'yearly'].includes(value);
}

export const DAILY_FORMAT = 'DD d MM yy';
export const WEEKLY_FORMAT = 'MM yy';
export const MONTHLY_FORMAT = 'MM yy';
export const YEARLY_FORMAT = 'yy';
export const RANGE_FORMAT = 'dd/mm/yy';