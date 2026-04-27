export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type SerializableValue = string | number | boolean | null | undefined;

export interface AtomOptions extends Omit<RequestInit, 'method'> {
  baseUrl?: string | undefined;
  params?: Record<string, SerializableValue> | undefined;
  timeout?: number | undefined;
  middlewares?: Middleware[] | undefined;
  validateStatus?: ((status: number) => boolean) | undefined;
  method?: Method | undefined;
}

export interface AtomResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: AtomOptions;
  ok: boolean;
}

export interface AtomContext {
  url: string;
  options: AtomOptions;
  instance: AtomInstance;
}

export type Next = () => Promise<AtomResponse>;
export type Middleware = (ctx: AtomContext, next: Next) => Promise<AtomResponse>;

export interface AtomInstance {
  use: (mw: Middleware) => AtomInstance;
  get: <T = unknown>(url: string, opts?: AtomOptions) => Promise<AtomResponse<T>>;
  post: <T = unknown>(url: string, data?: unknown, opts?: AtomOptions) => Promise<AtomResponse<T>>;
  put: <T = unknown>(url: string, data?: unknown, opts?: AtomOptions) => Promise<AtomResponse<T>>;
  patch: <T = unknown>(url: string, data?: unknown, opts?: AtomOptions) => Promise<AtomResponse<T>>;
  delete: <T = unknown>(url: string, opts?: AtomOptions) => Promise<AtomResponse<T>>;
  request: <T = unknown>(opts: AtomOptions & { url: string }) => Promise<AtomResponse<T>>;
  /** Gerenciador central de queries e cache global */
  query: import('./QueryManager').QueryManager;
}

export interface CacheEntry {
  response: AtomResponse;
  expiresAt: number;
}

export interface CacheStore {
  get: (key: string) => Promise<CacheEntry | undefined> | CacheEntry | undefined;
  set: (key: string, entry: CacheEntry) => Promise<void> | void;
  remove: (key: string) => Promise<void> | void;
  clear: () => Promise<void> | void;
}
