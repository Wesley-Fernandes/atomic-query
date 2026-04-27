// Core
export type {
  Method,
  SerializableValue,
  AtomOptions,
  AtomResponse,
  AtomContext,
  AtomInstance,
  Next,
  Middleware,
  CacheEntry,
  CacheStore,
} from './core/types';

export {
  AtomError,
  AtomTimeoutError,
  AtomAbortError,
  isAtomError,
  isAtomTimeout,
  isAtomAbort,
} from './core/errors';

export { createAtom, atom } from './core/factory';

// Middlewares
export { loggerMiddleware } from './middlewares/logger';
export type { LoggerOptions } from './middlewares/logger';
export { authMiddleware } from './middlewares/auth';
export { retryMiddleware } from './middlewares/retry';
export type { RetryOptions } from './middlewares/retry';
export { dedupMiddleware } from './middlewares/dedup';
export { cacheMiddleware, MemoryCacheStore, IDBCacheStore } from './middlewares/cache';
export type { CacheOptions } from './middlewares/cache';
export { swrMiddleware } from './middlewares/swr';
export type { SWROptions } from './middlewares/swr';
export { concurrencyMiddleware } from './middlewares/concurrency';
export type { ConcurrencyOptions } from './middlewares/concurrency';
export { csrfMiddleware } from './middlewares/csrf';
export type { CSRFOptions } from './middlewares/csrf';

// Streaming
export { streamRequest } from './streaming/streamRequest';
export type { StreamOptions } from './streaming/streamRequest';
export { sseStream } from './streaming/sseStream';
export type { SSEOptions } from './streaming/sseStream';
export { jsonStream } from './streaming/jsonStream';
export type { JsonStreamOptions } from './streaming/jsonStream';

// Presets
export { createProductionAtom } from './presets/production';
export type { ProductionAtomOptions } from './presets/production';

// React
export { useAtom } from './react/useAtom';
export * from './react/AtomContext';
export type { UseAtomOptions } from './react/useAtom';
