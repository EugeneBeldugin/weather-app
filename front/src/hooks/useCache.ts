interface CacheData<T> {
  data: T;
  timestamp: number;
}

interface CacheResult<T> {
  getFromCache: () => T | null;
  setToCache: (data: T) => void;
  clearCache: () => void;
}

export function useCache<T>(
  key: string,
  ttl: number = 5 * 60 * 1000,
): CacheResult<T> {
  const getCurrentTime = (): number => new Date().getTime();

  const isExpired = (timestamp: number): boolean => {
    return getCurrentTime() - timestamp > ttl;
  };

  const getFromCache = (): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const cachedData: CacheData<T> = JSON.parse(item);

      if (isExpired(cachedData.timestamp)) {
        localStorage.removeItem(key);
        return null;
      }

      return cachedData.data;
    } catch {
      return null;
    }
  };

  const setToCache = (data: T): void => {
    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: getCurrentTime(),
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch {
      localStorage.removeItem(key);
    }
  };

  const clearCache = (): void => {
    localStorage.removeItem(key);
  };

  return {
    getFromCache,
    setToCache,
    clearCache,
  };
}
