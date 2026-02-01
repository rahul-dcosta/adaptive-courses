// Simple in-memory cache for development
// In production, use Redis or similar

interface CacheEntry {
  value: any;
  expires: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry> = new Map();
  
  set(key: string, value: any, ttlSeconds: number = 3600) {
    this.cache.set(key, {
      value,
      expires: Date.now() + (ttlSeconds * 1000)
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  delete(key: string) {
    this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  // Cleanup expired entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new SimpleCache();

// Cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => cache.cleanup(), 5 * 60 * 1000);
}

// Helper to cache API responses
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached;
  
  const result = await fetcher();
  cache.set(key, result, ttlSeconds);
  return result;
}
