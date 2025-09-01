import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
export const redisClient = redisUrl && redisToken 
  ? new Redis({ url: redisUrl!, token: redisToken! }) 
  : null;

// In-memory cache structure
type CacheEntry = { value: any, expiry: number };
const memoryCache: Record<string, CacheEntry | undefined> = {};

/**
 * Get a cached value (returns undefined if not found or expired).
 */
export async function cacheGet<T>(key: string): Promise<T | undefined> {
  const now = Date.now();
  const entry = memoryCache[key];
  if (entry && entry.expiry > now) {
    return entry.value as T;
  }
  // If not in memory or expired, try Redis
  if (redisClient) {
    try {
      const data = await redisClient.get(key);
      if (data !== null) {
        // Reset in memory with a short TTL (remaining TTL not easily known, but default 5s)
        memoryCache[key] = { value: data, expiry: now + 5000 };
        return data as T;
      }
    } catch (e) {
      console.warn('Redis cache get error for key', key, e);
    }
  }
  return undefined;
}

/**
 * Set a cached value with TTL (in seconds).
 */
export async function cacheSet(key: string, value: any, ttlSeconds: number): Promise<void> {
  const now = Date.now();
  memoryCache[key] = { value, expiry: now + ttlSeconds * 1000 };
  if (redisClient) {
    try {
      await redisClient.set(key, value, { ex: ttlSeconds });
    } catch (e) {
      console.warn('Redis cache set error for key', key, e);
    }
  }
}
