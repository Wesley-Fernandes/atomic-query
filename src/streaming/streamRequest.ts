import type { AtomOptions } from '../core/types';
import { AtomAbortError, AtomError, AtomTimeoutError } from '../core/errors';
import { buildUrl } from '../core/engine';

export interface StreamOptions extends Omit<AtomOptions, 'method'> {
  /** Chamado a cada chunk de texto recebido */
  onChunk?: (chunk: string) => void;
  /** Chamado ao final com o texto completo concatenado */
  onDone?: (fullText: string) => void;
}

/**
 * Request com streaming via ReadableStream (nativo no fetch).
 * Ideal para:
 * - Respostas de LLMs (streaming de tokens)
 * - Download com barra de progresso
 * - Parsing de JSON gigante linha a linha (NDJSON)
 *
 * Nota: Bypassa o pipeline de middlewares intencionalmente —
 * streaming e buffering são mutuamente exclusivos.
 *
 * @example
 * await streamRequest('/api/chat', {
 *   method: 'POST',
 *   body: JSON.stringify({ message: 'Hello' }),
 *   headers: { 'Content-Type': 'application/json' },
 *   onChunk: (chunk) => process.stdout.write(chunk),
 *   onDone: (full) => console.log('Done:', full),
 * });
 */
export async function streamRequest(
  url: string,
  opts: StreamOptions & { baseUrl?: string } = {},
): Promise<string> {
  const { onChunk, onDone, baseUrl, params, timeout = 60_000, ...fetchOptions } = opts;

  const fullUrl = buildUrl(url, baseUrl, params);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('timeout'), timeout);

  try {
    const response = await fetch(fullUrl, { ...fetchOptions, signal: controller.signal });
    clearTimeout(timer);

    if (!response.body) {
      throw new Error('Atom: Response body is null — streaming not supported');
    }

    if (!response.ok) {
      throw new AtomError({
        data: null,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: opts,
        ok: false,
      });
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      onChunk?.(chunk);
    }

    onDone?.(fullText);
    return fullText;
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw controller.signal.reason === 'timeout'
        ? new AtomTimeoutError(timeout)
        : new AtomAbortError();
    }
    throw err;
  }
}
