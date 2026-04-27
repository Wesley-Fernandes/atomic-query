import type { CacheStore, CacheEntry, AtomResponse } from './types';

export type QueryEventType = 'invalidate' | 'update' | 'remove';

/**
 * Gerenciador central de consultas.
 * Permite invalidar, atualizar ou remover dados do cache de forma global.
 */
export class QueryManager {
  private listeners = new Set<(key: string, type: QueryEventType, data?: any) => void>();
  public store: CacheStore;

  constructor(store: CacheStore) {
    this.store = store;
  }

  /** Se inscreve para atualizações de cache */
  subscribe(listener: (key: string, type: QueryEventType, data?: any) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Invalida uma query: remove do cache e avisa os hooks para buscarem novamente.
   */
  async invalidate(key: string) {
    await this.store.remove(key);
    this.notify(key, 'invalidate');
  }

  /**
   * Troca os dados de uma query manualmente (Optimistic Update ou Mutação).
   */
  async setData<T = any>(key: string, data: T, ttl = 30_000) {
    const entry: CacheEntry = {
      response: {
        data,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        config: {} as any,
        ok: true,
      },
      expiresAt: Date.now() + ttl,
    };
    await this.store.set(key, entry);
    this.notify(key, 'update', data);
  }

  /**
   * Remove totalmente os dados de uma query sem disparar refetch automático.
   */
  async remove(key: string) {
    await this.store.remove(key);
    this.notify(key, 'remove');
  }

  /**
   * Limpa todo o cache de forma global.
   */
  async clear() {
    await this.store.clear();
    // Notifica todos os ouvintes com uma chave coringa para resetarem
    this.listeners.forEach((l) => l('*', 'invalidate'));
  }

  private notify(key: string, type: QueryEventType, data?: any) {
    this.listeners.forEach((l) => l(key, type, data));
  }
}
