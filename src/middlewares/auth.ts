import type { Middleware } from '../core/types';

/**
 * Injeta Bearer token em todas as requisições.
 * O getter é chamado a cada request — suporta tokens rotativos.
 *
 * @example
 * atom.use(authMiddleware(() => localStorage.getItem('token')))
 */
export const authMiddleware =
  (getToken: () => string | null | undefined): Middleware =>
  async (ctx, next) => {
    const token = getToken();
    if (token) {
      ctx.options.headers = {
        ...(ctx.options.headers as Record<string, string>),
        Authorization: `Bearer ${token}`,
      };
    }
    return next();
  };
