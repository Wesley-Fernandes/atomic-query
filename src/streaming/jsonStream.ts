import { buildUrl } from '../core/engine';
import type { AtomOptions } from '../core/types';

export interface JsonStreamOptions extends AtomOptions {
  /** Se true, assume que cada linha é um objeto JSON independente (NDJSON). Default: false */
  ndjson?: boolean;
}

/**
 * Utilitário de alta performance para ler JSONs massivos (GBs) sem crashar o browser.
 * Lê o stream e emite objetos à medida que são identificados.
 */
export async function* jsonStream<T = any>(url: string, opts: JsonStreamOptions = {}): AsyncGenerator<T> {
  const { baseUrl, params, ndjson = false, ...fetchOptions } = opts;
  const fullUrl = buildUrl(url, baseUrl, params);

  const response = await fetch(fullUrl, {
    ...fetchOptions,
    method: fetchOptions.method ?? 'GET',
    headers: {
      'Accept': 'application/json, application/x-ndjson',
      ...(fetchOptions.headers as Record<string, string>),
    },
  });

  if (!response.body) throw new Error('Atom: JSON Stream response body is null');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      if (ndjson) {
        // MODO NDJSON: Cada linha é um objeto
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // guarda linha incompleta

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) {
            try { yield JSON.parse(trimmed); } catch (e) { console.warn('Atom: Failed to parse NDJSON line', e); }
          }
        }
      } else {
        // MODO ARRAY: Identifica objetos { } dentro de um array [ ]
        // Este é um parser simplificado de alta performance
        let startIdx = 0;
        let depth = 0;
        let inString = false;

        for (let i = 0; i < buffer.length; i++) {
          const char = buffer[i];

          // Trata strings para ignorar { } dentro delas
          if (char === '"' && buffer[i - 1] !== '\\') {
            inString = !inString;
            continue;
          }

          if (inString) continue;

          if (char === '{' || char === '[') {
            if (depth === 1 && char === '{') startIdx = i; // Início de um objeto no array
            depth++;
          } else if (char === '}' || char === ']') {
            depth--;
            if (depth === 1 && char === '}') {
              // Encontrou um objeto completo
              const jsonStr = buffer.slice(startIdx, i + 1);
              try {
                yield JSON.parse(jsonStr);
              } catch (e) {
                console.warn('Atom: Failed to parse JSON object from stream', e);
              }
              startIdx = i + 1;
            }
          }
        }
        
        // Remove do buffer o que já foi processado
        if (startIdx > 0) {
          buffer = buffer.slice(startIdx);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
