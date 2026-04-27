import type { AtomOptions } from '../core/types';
import { buildUrl } from '../core/engine';

export interface SSEOptions extends AtomOptions {
  baseUrl?: string;
}

/**
 * Parser de Server-Sent Events via AsyncGenerator.
 * Emite cada evento `data:` como string, e encerra no marcador `[DONE]`.
 *
 * @example
 * for await (const event of sseStream('/api/events')) {
 *   console.log(JSON.parse(event));
 * }
 *
 * // Com timeout e baseUrl:
 * for await (const token of sseStream('/api/chat', {
 *   baseUrl: 'https://api.example.com',
 *   timeout: 30_000,
 * })) {
 *   process.stdout.write(token);
 * }
 */
export async function* sseStream(url: string, opts: SSEOptions = {}): AsyncGenerator<string> {
  const { baseUrl, params, timeout = 0, ...fetchOptions } = opts;

  const fullUrl = buildUrl(url, baseUrl, params);
  const controller = new AbortController();

  if (timeout > 0) {
    setTimeout(() => controller.abort('timeout'), timeout);
  }

  const response = await fetch(fullUrl, {
    ...fetchOptions,
    method: fetchOptions.method ?? 'GET',
    signal: controller.signal,
    headers: {
      Accept: 'text/event-stream',
      ...(fetchOptions.headers as Record<string, string>),
    },
  });

  if (!response.body) throw new Error('Atom: SSE response body is null');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const MAX_BUFFER_SIZE = 1024 * 1024; // 1MB limite por linha

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Segurança: evitar exaustão de memória
    if (buffer.length > MAX_BUFFER_SIZE) {
      throw new Error('Atom: SSE line buffer exceeded 1MB limit');
    }

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? ''; // guarda linha incompleta para o próximo chunk

    for (const line of lines) {
      if (line.startsWith('data:')) {
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') return;
        yield payload;
      }
    }
  }
}
