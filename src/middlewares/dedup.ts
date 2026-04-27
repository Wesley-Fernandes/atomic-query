import type { AtomContext, AtomResponse, Middleware } from '../core/types';

export interface DedupOptions {
  enabled?: boolean;
  keyFn?: (ctx: AtomContext) => string;
}
/**
 * Garante que apenas uma request por URL esteja em-flight por vez.
 * Múltiplas chamadas GET simultâneas para a mesma URL compartilham
 * uma única Promise — a rede é chamada apenas uma vez.
 *
 * @example
 * atom.use(dedupMiddleware())
 */
export const dedupMiddleware = (opts: DedupOptions = {}): Middleware => {
  const { enabled = true, keyFn = (ctx) => ctx.url } = opts;
  const inflight = new Map<string, Promise<AtomResponse>>();

  return (ctx, next) => {
    if (!enabled || ctx.options.method !== 'GET') return next();

    const key = keyFn(ctx);
    const existing = inflight.get(key);
    if (existing) return existing;

    const promise = next().finally(() => inflight.delete(key));
    inflight.set(key, promise);
    return promise;
  };
};
