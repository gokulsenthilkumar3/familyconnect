import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
client.on('error', (err) => console.error('[Redis] error:', err));
client.on('connect', () => console.log('[Redis] connected'));
client.connect().catch(console.error);

export const CACHE_TTL = { TREE: 300, MEMBERS: 180, EVENTS: 120, STATS: 600 } as const;

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
}

export async function cacheSet(key: string, value: unknown, ttl: number): Promise<void> {
  try { await client.setEx(key, ttl, JSON.stringify(value)); } catch { /* degrade */ }
}

export async function cacheInvalidate(...keys: string[]): Promise<void> {
  if (!keys.length) return;
  try { await client.del(keys); } catch { /* degrade */ }
}

export default client;
