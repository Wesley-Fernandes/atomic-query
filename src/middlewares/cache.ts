import type { AtomContext, CacheEntry, CacheStore, Middleware } from '../core/types';

/** Implementação em memória (Volátil) */
export class MemoryCacheStore implements CacheStore {
  private store = new Map<string, CacheEntry>();
  private readonly maxItems: number;

  constructor(maxItems = 1000) {
    this.maxItems = maxItems;
  }

  get = (key: string) => this.store.get(key);

  set = (key: string, entry: CacheEntry) => {
    if (this.store.size >= this.maxItems && !this.store.has(key)) {
      const firstKey = this.store.keys().next().value;
      if (firstKey !== undefined) this.store.delete(firstKey);
    }
    this.store.set(key, entry);
  };

  remove = async (key: string) => {
    this.store.delete(key);
  };

  clear = async () => {
    this.store.clear();
  };
}

/** Implementação persistente usando IndexedDB (Recomendado para Client-side) */
export class IDBCacheStore implements CacheStore {
  private db: IDBDatabase | null = null;
  private readonly dbName: string;
  private readonly storeName = 'responses';

  constructor(dbName = 'atom-cache') {
    this.dbName = dbName;
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(this.storeName);
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async get(key: string): Promise<CacheEntry | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const request = transaction.objectStore(this.storeName).get(key);
      request.onsuccess = () => {
        const entry = request.result;
        if (entry && entry.response && entry.response.headers) {
          // Rehidrata os headers
          entry.response.headers = new Headers(entry.response.headers);
        }
        resolve(entry);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async set(key: string, entry: CacheEntry): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');

      // Serializa Headers para objeto plano
      const headers: Record<string, string> = {};
      entry.response.headers.forEach((v, k) => {
        headers[k] = v;
      });

      const toStore = {
        ...entry,
        response: { ...entry.response, headers },
      };

      const request = transaction.objectStore(this.storeName).put(toStore, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async remove(key: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const request = transaction.objectStore(this.storeName).delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const request = transaction.objectStore(this.storeName).clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export interface CacheOptions {
  ttl?: number;
  store?: CacheStore;
  keyFn?: (ctx: AtomContext) => string;
}

export const cacheMiddleware = (opts: CacheOptions = {}): Middleware => {
  const { ttl = 30_000, store: customStore, keyFn = (ctx) => ctx.url } = opts;

  return async (ctx, next) => {
    if (ctx.options.method !== 'GET') return next();

    const store = customStore ?? ctx.instance.query.store;
    const key = keyFn(ctx);
    const hit = await store.get(key);

    if (hit && hit.expiresAt > Date.now()) return hit.response;
    if (hit) await store.remove(key);

    const response = await next();
    await store.set(key, { response, expiresAt: Date.now() + ttl });
    return response;
  };
};
