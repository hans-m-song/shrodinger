export interface Ok<T> {
  ok: true;
  data: T;
}

export const ok = <T>(data: T): Ok<T> => ({
  ok: true,
  data,
});

export const isOk = <T>(result: Result<T>): result is Ok<T> => result.ok;

export const mustOk = <T>(result: Result<T>): T => {
  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};

export interface Err {
  ok: false;
  error: Error;
}

export const err = <T extends Error>(error: T): Err => ({
  ok: false,
  error,
});

export const isErr = <T>(result: Result<T>): result is Err => !result.ok;

export type Result<T> = Ok<T> | Err;

type AsyncFn = (...args: any[]) => Promise<any>;

export const safe =
  <R extends Awaited<ReturnType<F>>, F extends AsyncFn>(fn: F) =>
  async (...args: Parameters<F>): Promise<Result<R>> => {
    try {
      const data: R = await fn(...args);
      return ok(data);
    } catch (error: unknown) {
      return err(error as Error);
    }
  };

type Fn = (...args: any[]) => any;

export const safeSync =
  <R extends ReturnType<F>, F extends Fn>(fn: F) =>
  (...args: Parameters<F>): Result<R> => {
    try {
      const data: R = fn(...args);
      return ok(data);
    } catch (error: unknown) {
      return err(error as Error);
    }
  };
