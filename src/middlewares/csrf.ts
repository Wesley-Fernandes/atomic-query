import type { Middleware } from '../core/types';

export interface CSRFOptions {
  /** Nome do cookie onde o token está guardado. Default: 'XSRF-TOKEN' */
  cookieName?: string;
  /** Nome do header a ser enviado. Default: 'X-XSRF-TOKEN' */
  headerName?: string;
}

/**
 * Middleware para proteção CSRF em browsers.
 * Lê o token de um cookie e o injeta no header da requisição.
 *
 * @example
 * atom.use(csrfMiddleware())
 */
export const csrfMiddleware = (opts: CSRFOptions = {}): Middleware => {
  const { cookieName = 'XSRF-TOKEN', headerName = 'X-XSRF-TOKEN' } = opts;

  return (ctx, next) => {
    // Apenas em ambiente de browser
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp(`(^|;\\s*)${cookieName}=([^;]*)`));
      const token = match ? decodeURIComponent(match[2]!) : null;

      if (token) {
        ctx.options.headers = {
          ...(ctx.options.headers as Record<string, string>),
          [headerName]: token,
        };
      }
    }
    return next();
  };
};
