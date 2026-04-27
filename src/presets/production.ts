import type { AtomInstance, AtomOptions } from '../core/types';
import { createAtom } from '../core/factory';
import { authMiddleware } from '../middlewares/auth';
import { concurrencyMiddleware } from '../middlewares/concurrency';
import { dedupMiddleware } from '../middlewares/dedup';
import { retryMiddleware } from '../middlewares/retry';
import { swrMiddleware } from '../middlewares/swr';
import { IDBCacheStore } from '../middlewares/cache';

export interface ProductionAtomOptions extends AtomOptions {
  /** Getter de token para o authMiddleware. Omita para desabilitar auth. */
  getToken?: () => string | null | undefined;
  /** TTL do SWR em ms. Default: 10_000 */
  swrTtl?: number;
  /** Número de retries. Default: 3 */
  retries?: number;
  /** Máximo de requests simultâneas. Default: 6 */
  maxConcurrency?: number;
  /** Habilita ou desabilita o dedupMiddleware. Default: true */
  dedup?: boolean;
  /** Habilita persistência automática via IndexedDB no browser. Default: false */
  persist?: boolean;
  /** Nome do banco de dados para persistência. Default: 'atom-cache' */
  persistName?: string;
}

/**
 * Cria uma instância com o stack completo de middlewares para produção.
 *
 * Ordem de execução:
 * 1. concurrency  — limita slots antes de qualquer verificação de cache
 * 2. dedup        — colapsa requests idênticas em uma só Promise
 * 3. swr          — serve stale + revalida em background
 * 4. retry        — retenta com Full Jitter se tudo acima falhar
 * 5. auth         — injeta Bearer token (se getToken for fornecido)
 *
 * @example
 * const api = createProductionAtom({
 *   baseUrl: 'https://api.example.com',
 *   getToken: () => sessionStorage.getItem('token'),
 *   swrTtl: 10_000,
 *   retries: 3,
 *   maxConcurrency: 6,
 * });
 *
 * const { data } = await api.get<User[]>('/users');
 */
export const createProductionAtom = (opts: ProductionAtomOptions = {}): AtomInstance => {
  const {
    getToken,
    swrTtl = 10_000,
    retries = 3,
    maxConcurrency = 6,
    dedup = false,
    persist = false,
    persistName = 'atom-cache',
    ...baseConfig
  } = opts;

  const instance = createAtom(baseConfig);

  // Zero-Config Persistence
  if (persist && typeof window !== 'undefined') {
    instance.query.store = new IDBCacheStore(persistName);
  }

  instance.use(concurrencyMiddleware({ max: maxConcurrency }));
  if (dedup) instance.use(dedupMiddleware({}));
  instance.use(swrMiddleware({ ttl: swrTtl }));
  instance.use(retryMiddleware({ retries, baseDelay: 300, maxDelay: 30_000 }));
  if (getToken) instance.use(authMiddleware(getToken));

  return instance;
};
