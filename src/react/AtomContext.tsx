import React, { createContext, useContext, ReactNode } from 'react';
import { atom } from '../core/factory';
import type { AtomInstance } from '../core/types';

const AtomContext = createContext<AtomInstance>(atom);

export interface AtomProviderProps {
  instance: AtomInstance;
  children: ReactNode;
}

/**
 * Provedor que injeta uma instância customizada do Atomic Query em toda a árvore React.
 */
export function AtomProvider({ instance, children }: AtomProviderProps) {
  return (
    <AtomContext.Provider value={instance}>
      {children}
    </AtomContext.Provider>
  );
}

/**
 * Hook interno para acessar a instância do contexto.
 */
export function useAtomInstance() {
  return useContext(AtomContext);
}
