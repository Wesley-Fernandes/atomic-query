import type {
  AtomContext,
  AtomOptions,
  AtomResponse,
  Middleware,
  SerializableValue,
} from './types';
import { AtomAbortError, AtomError, AtomTimeoutError } from './errors';

// ─── URL ─────────────────────────────────────────────────────────────────────

const DEFAULT_BASE = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';

export const buildUrl = (
  url: string,
  baseUrl?: string,
  params?: Record<string, SerializableValue>,
): string => {
  const full = url.startsWith('http') ? new URL(url) : new URL(url, baseUrl ?? DEFAULT_BASE);

  // Segurança: bloquear protocolos perigosos
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
  if (dangerousProtocols.includes(full.protocol)) {
    throw new Error(`Atom: Dangerous protocol detected: ${full.protocol}`);
  }

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) full.searchParams.append(k, String(v));
    }
  }
  return full.toString();
};

// ─── BODY ────────────────────────────────────────────────────────────────────

const isFormData = (v: unknown): v is FormData =>
  typeof FormData !== 'undefined' && v instanceof FormData;

const isBlob = (v: unknown): v is Blob => typeof Blob !== 'undefined' && v instanceof Blob;

export const resolveBody = (data: unknown): BodyInit | null => {
  if (data === undefined || data === null) return null;
  if (isFormData(data) || isBlob(data) || typeof data === 'string') return data as BodyInit;
  return JSON.stringify(data);
};

export const resolveContentType = (data: unknown): Record<string, string> => {
  if (isFormData(data) || isBlob(data) || typeof data === 'string') return {};
  return { 'Content-Type': 'application/json' };
};

export const buildBodyOptions = (data?: unknown, opts?: AtomOptions): Partial<AtomOptions> => {
  const body = resolveBody(data);
  return {
    ...opts,
    ...(body !== null ? { body } : {}),
    headers: {
      ...resolveContentType(data),
      ...(opts?.headers as Record<string, string>),
    },
  };
};

// ─── DISPATCH ────────────────────────────────────────────────────────────────

export async function dispatchRequest(ctx: AtomContext): Promise<AtomResponse> {
  const {
    timeout = 10_000,
    validateStatus = (s) => s >= 200 && s < 300,
    params: _p,
    baseUrl: _b,
    middlewares: _m,
    method,
    ...fetchOptions
  } = ctx.options;

  const controller = new AbortController();

  const externalSignal = fetchOptions.signal as AbortSignal | undefined;
  if (externalSignal?.aborted) throw new AtomAbortError();
  externalSignal?.addEventListener('abort', () => controller.abort());

  const timer = setTimeout(() => controller.abort('timeout'), timeout);

  try {
    const response = await fetch(ctx.url, {
      ...fetchOptions,
      signal: controller.signal,
      ...(method ? { method } : {}),
    });
    clearTimeout(timer);

    const ct = response.headers.get('content-type') ?? '';
    const data: unknown = ct.includes('application/json')
      ? await response.json()
      : ct.includes('text/')
        ? await response.text()
        : await response.blob();

    const atomResponse: AtomResponse = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: ctx.options,
      ok: validateStatus(response.status),
    };

    if (!atomResponse.ok) throw new AtomError(atomResponse);
    return atomResponse;
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof AtomError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw controller.signal.reason === 'timeout'
        ? new AtomTimeoutError(timeout)
        : new AtomAbortError();
    }
    throw err;
  }
}

// ─── COMPOSE ─────────────────────────────────────────────────────────────────

export function compose(middlewares: Middleware[]) {
  return (ctx: AtomContext): Promise<AtomResponse> => {
    function dispatch(i: number): Promise<AtomResponse> {
      if (i === middlewares.length) return dispatchRequest(ctx);
      const fn = middlewares[i];
      if (!fn) return dispatchRequest(ctx);
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };
}
