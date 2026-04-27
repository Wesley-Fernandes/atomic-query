import { Middleware } from '../core/types';

export interface LoggerOptions {
  /** Se true, desabilita a sanitização de headers sensíveis para facilitar o debug. Default: false */
  devMode?: boolean;
}

/**
 * Loga todas as requisições com tempo de resposta.
 *
 * @example
 * atom.use(loggerMiddleware({ devMode: true }))
 */
export const loggerMiddleware = (opts: LoggerOptions = {}): Middleware => {
  const { devMode = false } = opts;

  return async (ctx, next) => {
    const start = performance.now();
    const method = ctx.options.method ?? 'GET';

    // Sanitização de headers sensíveis (apenas se não estiver em devMode)
    const sanitizeHeaders = (headers: any) => {
      if (!headers || devMode) return headers;
      const sensitive = ['authorization', 'cookie', 'set-cookie', 'x-api-key'];
      const clean = { ...headers };
      for (const key of Object.keys(clean)) {
        if (sensitive.includes(key.toLowerCase())) clean[key] = '********';
      }
      return clean;
    };

    console.groupCollapsed(`[Atom] ${method} ${ctx.url}`);
    console.log('Options:', { ...ctx.options, headers: sanitizeHeaders(ctx.options.headers) });
    try {
      const res = await next();
      console.log(`✓ ${res.status} in ${(performance.now() - start).toFixed(1)}ms`, res.data);
      return res;
    } catch (err) {
      console.error(`✗ Error after ${(performance.now() - start).toFixed(1)}ms`, err);
      throw err;
    } finally {
      console.groupEnd();
    }
  };
};
