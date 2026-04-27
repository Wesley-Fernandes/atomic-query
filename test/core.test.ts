import { describe, it, expect, vi, beforeEach } from 'vitest';
import { atom, createAtom } from '../src/core/factory';
import { AtomError } from '../src/core/errors';

describe('Atom Core', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(async (url: string) => {
      if (url.includes('/success')) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url.includes('/error')) {
        return new Response(JSON.stringify({ error: 'failed' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(null, { status: 404 });
    }) as any;
  });

  it('should make a basic GET request', async () => {
    const res = await atom.get('http://api.com/success');
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ ok: true });
    expect(res.ok).toBe(true);
  });

  it('should handle custom baseUrl and params', async () => {
    const api = createAtom({ baseUrl: 'https://api.test' });
    await api.get('/success', { params: { foo: 'bar' } });

    const call = vi.mocked(fetch).mock.calls[0];
    expect(call![0]).toBe('https://api.test/success?foo=bar');
  });

  it('should throw AtomError on 4xx/5xx', async () => {
    try {
      await atom.get('http://api.com/error');
      expect(true).toBe(false); // Should not reach here
    } catch (err) {
      expect(err).toBeInstanceOf(AtomError);
      expect((err as AtomError).response.status).toBe(400);
    }
  });

  it('should merge headers correctly', async () => {
    const api = createAtom({ headers: { 'X-API-Key': '123' } });
    await api.get('http://api.com/success', { headers: { 'X-Custom': 'val' } });

    const call = vi.mocked(fetch).mock.calls[0];
    const headers = (call![1] as RequestInit).headers as Record<string, string>;
    expect(headers['X-API-Key']).toBe('123');
    expect(headers['X-Custom']).toBe('val');
  });

  it('should handle body serialization for POST', async () => {
    await atom.post('http://api.com/success', { name: 'test' });

    const call = vi.mocked(fetch).mock.calls[0];
    expect(call![1]!.method).toBe('POST');
    expect(call![1]!.body).toBe(JSON.stringify({ name: 'test' }));
    const headers = (call![1] as RequestInit).headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
  });
});
