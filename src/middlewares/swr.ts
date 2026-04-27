import type { AtomResponse, CacheStore, Middleware } from '../core/types';
import { MemoryCacheStore } from './cache';

export interface SWROptions {
  /** Tempo em ms antes do cache ser considerado stale. Default: 5_000 */
  ttl?: number;
  /** Store customizável. Default: MemoryCacheStore */
  store?: CacheStore;
  /** Callback chamado após revalidação em background */
  onRevalidate?: (url: string, response: AtomResponse) => void;
  /** Callback chamado em caso de erro na revalidação em background */
  onRevalidateError?: (url: string, error: unknown) => void;
}

/**
 * Stale-While-Revalidate: serve cache instantaneamente e revalida em background.
 * UX percebida = zero loading para dados cacheados.
 *
 * @example
 * atom.use(swrMiddleware({ ttl: 10_000, store: new IDBCacheStore() }))
 */
export const swrMiddleware = (opts: SWROptions = {}): Middleware => {
  const { ttl = 5_000, store: customStore, onRevalidate, onRevalidateError } = opts;

  return async (ctx, next) => {
    if (ctx.options.method !== 'GET') return next();

    const store = customStore ?? ctx.instance.query.store;
    const key = ctx.url;
    const hit = await store.get(key);
    const isStale = hit ? Date.now() - (hit.expiresAt - ttl) > ttl : false;

    if (hit) {
      if (isStale) {
        // Revalidação em background
        next()
          .then(async (res) => {
            await store.set(key, { response: res, expiresAt: Date.now() + ttl });
            onRevalidate?.(key, res);
          })
          .catch((err) => onRevalidateError?.(key, err));
      }
      return hit.response;
    }

    const response = await next();
    await store.set(key, { response, expiresAt: Date.now() + ttl });
    return response;
  };
};
