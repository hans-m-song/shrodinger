export interface Some<T> {
  ok: true;
  value: T;
}

export const some = <T>(value: T): Some<T> => ({
  ok: true,
  value,
});

export interface None {
  ok: false;
}

export const none = (): None => ({
  ok: false,
});

export type Maybe<T> = Some<T> | None;

type Fn = (...args: any[]) => any;

export const maybe =
  <F extends Fn>(fn: F) =>
  (...args: Parameters<F>): Maybe<ReturnType<F>> => {
    const value = fn(...args);
    if (value) {
      return some(value);
    }

    return none();
  };
