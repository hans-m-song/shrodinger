export interface Ok<T> {
  ok: true;
  data: T;
}

export interface Err {
  ok: false;
  error: Error;
}

export type Result<T> = Ok<T> | Err;

export namespace Result {
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

  export const err = <T extends Error>(error: T): Err => ({
    ok: false,
    error,
  });

  export const isErr = <T>(result: Result<T>): result is Err => !result.ok;

  export const and = async <T, U>(
    result: Result<T> | Promise<Result<T>>,
    fn: (input: T) => U | Promise<U>,
  ): Promise<Result<U>> => {
    const r = await result;
    if (!r.ok) {
      return result as Result<U>;
    }

    return fromFn(fn)(r.data);
  };

  export const or = async <T>(
    result: Result<T> | Promise<Result<T>>,
    fn: (error: Error) => Error,
  ): Promise<Result<T>> => {
    const r = await result;
    if (r.ok) {
      return result;
    }

    return err(fn(r.error));
  };

  export const match = <T, U>(
    result: Result<T>,
    branches: {
      ok: (value: T) => U;
      err: (error: Error) => Error;
    },
  ): Result<U> => {
    if (result.ok) {
      return ok(branches.ok(result.data)) as Result<U>;
    }

    return err(branches.err(result.error));
  };

  /**
   * Awaits a promise and wraps the output in a `Result`
   */
  export const fromPromise = async <T>(
    promise: Promise<T>,
  ): Promise<Result<T>> => {
    try {
      return ok(await promise);
    } catch (error: unknown) {
      return err(error as Error);
    }
  };

  type Fn = (...args: any[]) => Promise<any> | any;

  /**
   * Converts an async function that may throw into one that will return a
   * `Result`
   *
   * note - ensure you provide `thisArg` for class methods
   */
  export const fromFn =
    <R extends Awaited<ReturnType<F>>, F extends Fn>(fn: F, thisArg?: any) =>
    async (...args: Parameters<F>): Promise<Result<R>> => {
      try {
        const data: R = thisArg
          ? await fn.call(thisArg, ...args)
          : await fn(...args);
        return ok(data);
      } catch (error: unknown) {
        return err(error as Error);
      }
    };

  /**
   * A synchronous version of fromFn
   */
  export const fromFnSync =
    <R extends ReturnType<F>, F extends Fn>(fn: F, thisArg?: any) =>
    (...args: Parameters<F>): Result<R> => {
      try {
        const data: R = thisArg ? fn.call(thisArg, ...args) : fn(...args);
        return ok(data);
      } catch (error: unknown) {
        return err(error as Error);
      }
    };
}
