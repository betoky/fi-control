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