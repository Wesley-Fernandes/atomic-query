import type { AtomResponse, Middleware } from '../core/types';

export interface ConcurrencyOptions {
  /** Máximo de requests simultâneas. Default: 6 (limite HTTP/1.1 por domínio) */
  max?: number;
}

/**
 * Semáforo de concorrência: garante no máximo N requests ativas por vez.
 * Requests excedentes ficam em fila FIFO e executam assim que uma vaga abre.
 *
 * Útil para:
 * - Evitar burst em APIs com rate limit
 * - Respeitar o limite de conexões HTTP/1.1 dos browsers (6 por host)
 *
 * @example
 * atom.use(concurrencyMiddleware({ max: 4 }))
 */
export const concurrencyMiddleware = (opts: ConcurrencyOptions = {}): Middleware => {
  const { max = 6 } = opts;
  let active = 0;
  const queue: Array<() => void> = [];

  const dequeue = () => {
    if (active >= max || queue.length === 0) return;
    active++;
    queue.shift()!();
  };

  return (_ctx, next) =>
    new Promise<AtomResponse>((resolve, reject) => {
      const execute = () => {
        next()
          .then(resolve, reject)
          .finally(() => {
            active--;
            dequeue();
          });
      };

      if (active < max) {
        active++;
        execute();
      } else {
        queue.push(execute);
      }
    });
};
