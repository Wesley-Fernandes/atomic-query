import type { Middleware } from '../core/types';
import { isAtomAbort } from '../core/errors';

export interface RetryOptions {
  /** Número de tentativas após a falha inicial. Default: 3 */
  retries?: number;
  /** Delay base em ms para o cálculo exponencial. Default: 300 */
  baseDelay?: number;
  /** Delay máximo em ms (cap do backoff). Default: 30_000 */
  maxDelay?: number;
  /** Predicado para decidir se deve retentar. Default: sempre retenta */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

/**
 * Full Jitter (AWS-recommended): backoff exponencial com ruído aleatório.
 * Evita thundering herd — múltiplos clientes falhando ao mesmo tempo
 * não retentem no mesmo milissegundo.
 *
 * Ref: https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
 *
 * @example
 * atom.use(retryMiddleware({ retries: 3, baseDelay: 300 }))
 */
export const retryMiddleware = (opts: RetryOptions = {}): Middleware => {
  const { retries = 3, baseDelay = 300, maxDelay = 30_000, shouldRetry = () => true } = opts;

  const jitter = (attempt: number): number => {
    const exponential = Math.min(maxDelay, baseDelay * 2 ** attempt);
    return Math.random() * exponential;
  };

  return async (ctx, next) => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await next();
      } catch (err) {
        lastError = err;

        // Nunca retentar aborts intencionais
        if (isAtomAbort(err)) throw err;

        if (attempt < retries && shouldRetry(err, attempt)) {
          await new Promise((res) => setTimeout(res, jitter(attempt)));
        } else {
          break;
        }
      }
    }

    throw lastError;
  };
};
