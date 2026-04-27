import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAtom } from '../src/core/factory';
import { cacheMiddleware } from '../src/middlewares/cache';

describe('Atom Query Management', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true, val: Math.random() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as any;
  });

  it('should initialize with a QueryManager', () => {
    const api = createAtom();
    expect(api.query).toBeDefined();
    expect(typeof api.query.invalidate).toBe('function');
  });

  it('should invalidate cache globally', async () => {
    const api = createAtom();
    api.use(cacheMiddleware());

    // Primeira requisição (vai para o cache)
    const res1 = await api.get('http://api.com/users');
    const res2 = await api.get('http://api.com/users');
    expect(res1.data).toEqual(res2.data);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);

    // Invalidação global
    await api.query.invalidate('http://api.com/users');

    // Terceira requisição (deve bater na rede de novo)
    await api.get('http://api.com/users');
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
  });

  it('should update data manually (Mutations)', async () => {
    const api = createAtom();
    api.use(cacheMiddleware());

    const url = 'http://api.com/profile';
    const manualData = { name: 'Atom User' };

    // Define os dados manualmente
    await api.query.setData(url, manualData);

    // Requisição deve retornar os dados manuais sem chamar o fetch
    const res = await api.get(url);
    expect(res.data).toEqual(manualData);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it('should notify subscribers on invalidation', async () => {
    const api = createAtom();
    const callback = vi.fn();

    api.query.subscribe(callback);

    await api.query.invalidate('test-key');

    expect(callback).toHaveBeenCalledWith('test-key', 'invalidate', undefined);
  });

  it('should notify subscribers on manual data update', async () => {
    const api = createAtom();
    const callback = vi.fn();
    const data = { foo: 'bar' };

    api.query.subscribe(callback);

    await api.query.setData('test-key', data);

    expect(callback).toHaveBeenCalledWith('test-key', 'update', data);
  });
});
