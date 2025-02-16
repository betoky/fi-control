export type Periodicity = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function isPeriodictyType(value: string): value is Periodicity {
  return ['daily', 'weekly', 'monthly', 'yearly'].includes(value);
}