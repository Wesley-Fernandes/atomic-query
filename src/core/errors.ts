import type { AtomResponse } from './types';

// V8-specific — ausente no lib.dom; cast seguro para ambientes Node/browser
const captureStack = (Error as unknown as Record<string, unknown>).captureStackTrace as
  | ((target: object, ctor: Function) => void)
  | undefined;

export class AtomError extends Error {
  public readonly response: AtomResponse;

  constructor(response: AtomResponse) {
    super(`Atom: Request failed with status ${response.status} (${response.statusText})`);
    this.name = 'AtomError';
    this.response = response;
    captureStack?.(this, AtomError);
  }
}

export class AtomTimeoutError extends Error {
  constructor(public readonly timeout: number) {
    super(`Atom: Request timed out after ${timeout}ms`);
    this.name = 'AtomTimeoutError';
    captureStack?.(this, AtomTimeoutError);
  }
}

export class AtomAbortError extends Error {
  constructor() {
    super('Atom: Request was aborted');
    this.name = 'AtomAbortError';
    captureStack?.(this, AtomAbortError);
  }
}

/** Narrowing: verifica se é um erro HTTP (status fora do range válido) */
export const isAtomError = (err: unknown): err is AtomError => err instanceof AtomError;

/** Narrowing: verifica se foi timeout */
export const isAtomTimeout = (err: unknown): err is AtomTimeoutError =>
  err instanceof AtomTimeoutError;

/** Narrowing: verifica se foi abort manual */
export const isAtomAbort = (err: unknown): err is AtomAbortError => err instanceof AtomAbortError;
