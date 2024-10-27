export interface Some<T> {
  ok: true;
  value: T;
}

export interface None {
  ok: false;
}

export type Maybe<T> = Some<T> | None;

export namespace Maybe {
  export const some = <T>(value: T): Some<T> => ({
    ok: true,
    value,
  });

  export const none = (): None => ({
    ok: false,
  });

  type Fn = (...args: any[]) => any;

  export const fromFn =
    <F extends Fn>(fn: F) =>
    (...args: Parameters<F>): Maybe<ReturnType<F>> => {
      const value = fn(...args);
      if (value) {
        return some(value);
      }

      return none();
    };
}
