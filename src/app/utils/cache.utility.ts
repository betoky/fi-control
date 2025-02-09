import { QueryError } from "@supabase/supabase-js";

export function getCached<T>(key: string) {
  const cachedData = localStorage.getItem('fi-' + key);
  const expireAt = localStorage.getItem('fi-' + key + 'Exp');
  const now = new Date().getTime();

  if (cachedData && expireAt && now < Number(expireAt)) {
    return JSON.parse(cachedData) as T;
  }
  return null;
}

export function setCache<T>(key: string, data: T) {
  const expirationDuration = 24 * 60 * 60 * 1000; // 24 hours
  const now = new Date().getTime();
  localStorage.setItem('fi-' + key, JSON.stringify(data));
  localStorage.setItem('fi-' + key + 'Exp', (now + expirationDuration).toString());
}

export function removeCached(key: string) {
  localStorage.removeItem('fi-' + key);
  localStorage.removeItem('fi-' + key + 'Exp');
}

export async function cacheSupabaseQuery<R>(
  key: string,
  query: unknown
) {
  const cachedData = getCached<R>(key);
  if (cachedData) {
    return cachedData;
  }

  const response = await query;

  if (!isAwaitedResultOfSupabaseQuery<R>(response)) {
    return null;
  }
  
  const { data, error } = response;
  if (error) throw error;

  setCache(key, data);

  return data;
}

function isAwaitedResultOfSupabaseQuery<DataType>(value: unknown): value is {data: DataType; error: QueryError | null} {
  return value !== null && typeof value === 'object' && 'data' in value && 'error' in value;
}