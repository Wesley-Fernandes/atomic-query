import { useState, useEffect, useCallback, useRef } from 'react';
import { atom as defaultAtom } from '../core/factory';
import { useAtomInstance } from './AtomContext';
import type { AtomOptions, AtomInstance } from '../core/types';

export interface UseAtomOptions extends AtomOptions {
  /** Instância customizada do Atom. Se não fornecida, usa a instância padrão ou a do Contexto. */
  instance?: AtomInstance;
  /** Se true, a requisição não será disparada automaticamente no mount. Default: false */
  manual?: boolean;
  /** Se true, dispara um refetch quando a janela ganha foco. Default: true */
  refetchOnFocus?: boolean;
}

/**
 * Hook de integração Atom + React com suporte a invalidação global e refetch on focus.
 */
export function useAtom<T = any>(url: string, opts: UseAtomOptions = {}) {
  const contextInstance = useAtomInstance();
  const atom = opts.instance || contextInstance || defaultAtom;
  const { manual = false, refetchOnFocus = true, ...atomOptions } = opts;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!manual);
  const [error, setError] = useState<any>(null);

  const optionsRef = useRef(atomOptions);
  optionsRef.current = atomOptions;

  const fetcher = useCallback(async () => {
    setLoading(true);
    try {
      const res = await atom.get<T>(url, optionsRef.current);
      setData(res.data);
      setError(null);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, atom]);

  // 1. Escuta atualizações globais do QueryManager
  useEffect(() => {
    return atom.query.subscribe((targetKey: string, type: string, newData?: any) => {
      // Se for um reset global (clear), revalida tudo
      if (targetKey === '*' && type === 'invalidate') {
        fetcher().catch(() => {});
        return;
      }

      if (targetKey !== url) return;

      if (type === 'invalidate') {
        fetcher().catch(() => {});
      } else if (type === 'update') {
        setData(newData);
        setLoading(false);
        setError(null);
      } else if (type === 'remove') {
        setData(null);
      }
    });
  }, [url, atom, fetcher]);

  // 2. Refetch on Window Focus
  useEffect(() => {
    if (typeof window === 'undefined' || !refetchOnFocus) return;

    const onFocus = () => {
      if (!loading && !manual) {
        fetcher().catch(() => {});
      }
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refetchOnFocus, loading, manual, fetcher]);

  // 3. Initial Fetch
  useEffect(() => {
    if (!manual) {
      fetcher().catch(() => {});
    }
  }, [url, manual, fetcher]);

  return {
    data,
    loading,
    error,
    refetch: fetcher,
    ok: !loading && !error && data !== null,
  };
}
