import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAtom } from '../src/core/factory';
import { authMiddleware } from '../src/middlewares/auth';
import { retryMiddleware } from '../src/middlewares/retry';
import { dedupMiddleware } from '../src/middlewares/dedup';
import { cacheMiddleware } from '../src/middlewares/cache';
import { swrMiddleware } from '../src/middlewares/swr';

describe('Atom Middlewares', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true, time: Date.now() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as any;
  });

  it('authMiddleware should inject bearer token', async () => {
    const api = createAtom();
    api.use(authMiddleware(() => 'secret-token'));

    await api.get('http://api.com');

    const call = vi.mocked(fetch).mock.calls[0];
    const headers = (call![1] as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer secret-token');
  });

  it('dedupMiddleware should collapse concurrent requests', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn(async () => {
      callCount++;
      await new Promise((r) => setTimeout(r, 10));
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }) as any;

    const api = createAtom();
    api.use(dedupMiddleware());

    const p1 = api.get('http://api.com/dedup');
    const p2 = api.get('http://api.com/dedup');
    const p3 = api.get('http://api.com/dedup');

    await Promise.all([p1, p2, p3]);

    expect(callCount).toBe(1);
  });

  it('retryMiddleware should retry on failure', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn(async () => {
      callCount++;
      if (callCount < 3) {
        throw new Error('Network error');
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }) as any;

    const api = createAtom();
    api.use(retryMiddleware({ retries: 3, baseDelay: 0 }));

    const res = await api.get('http://api.com/retry');
    expect(res.ok).toBe(true);
    expect(callCount).toBe(3);
  });

  it('cacheMiddleware should return cached response', async () => {
    const api = createAtom();
    api.use(cacheMiddleware({ ttl: 1000 }));

    const res1 = await api.get('http://api.com/cache');
    const res2 = await api.get('http://api.com/cache');

    expect(res1.data).toEqual(res2.data);
    expect(vi.mocked(fetch).mock.calls.length).toBe(1);
  });

  it('swrMiddleware should return stale data and revalidate', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn(async () => {
      callCount++;
      return new Response(JSON.stringify({ val: callCount }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as any;

    const api = createAtom();
    api.use(swrMiddleware({ ttl: 100 })); // TTL mais longo para estabilidade

    const res1 = await api.get('http://api.com/swr');
    expect(res1.data).toEqual({ val: 1 });

    // Espera o TTL passar (150ms > 100ms)
    await new Promise((r) => setTimeout(r, 150));

    const res2 = await api.get('http://api.com/swr');
    expect(res2.data).toEqual({ val: 1 }); // Retornou o stale (ainda val: 1)

    // Espera a revalidação terminar e o novo TTL ainda ser válido
    await new Promise((r) => setTimeout(r, 50));

    const res3 = await api.get('http://api.com/swr');
    expect(res3.data).toEqual({ val: 2 }); // Agora tem o dado novo e está "fresh"
    expect(callCount).toBe(2);
  });
});
