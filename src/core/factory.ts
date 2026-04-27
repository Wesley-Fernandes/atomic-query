import type { AtomContext, AtomInstance, AtomOptions } from './types';
import { buildBodyOptions, buildUrl, compose } from './engine';
import { QueryManager } from './QueryManager';
import { MemoryCacheStore } from '../middlewares/cache';

export const createAtom = (defaultConfig: AtomOptions = {}): AtomInstance => {
  const instanceMiddlewares = [...(defaultConfig.middlewares ?? [])];
  const query = new QueryManager(new MemoryCacheStore());

  const run = async <T>(path: string, options: AtomOptions = {}) => {
    const mergedOptions: AtomOptions = {
      ...defaultConfig,
      ...options,
      headers: {
        ...(defaultConfig.headers as Record<string, string>),
        ...(options.headers as Record<string, string>),
      },
      middlewares: undefined,
    };

    const url = buildUrl(path, mergedOptions.baseUrl, mergedOptions.params);
    const ctx: AtomContext = { url, options: mergedOptions, instance };
    const chain = compose([...instanceMiddlewares, ...(options.middlewares ?? [])]);
    return chain(ctx) as Promise<import('./types').AtomResponse<T>>;
  };

  const instance: AtomInstance = {
    use(mw) {
      instanceMiddlewares.push(mw);
      return instance;
    },
    get: (url, opts) => run(url, { ...opts, method: 'GET' }),
    post: (url, data, opts) => run(url, { ...buildBodyOptions(data, opts), method: 'POST' }),
    put: (url, data, opts) => run(url, { ...buildBodyOptions(data, opts), method: 'PUT' }),
    patch: (url, data, opts) => run(url, { ...buildBodyOptions(data, opts), method: 'PATCH' }),
    delete: (url, opts) => run(url, { ...opts, method: 'DELETE' }),
    request: ({ url, ...opts }) => run(url, opts),
    query,
  };

  return instance;
};

/** Instância padrão pronta para uso */
export const atom = createAtom();
