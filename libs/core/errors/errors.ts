import { CoreError } from './core.error';

interface Constructable {
  new (...args: any[]): any;
}

export const errors = {
  as:
    <T extends Constructable>(kind: T) =>
    (error: unknown): T | undefined => {
      if (typeof error !== 'object' || error === null) {
        return undefined;
      }

      try {
        if (error instanceof kind) {
          return error as T;
        }

        if (error instanceof CoreError) {
          return errors.as(kind)(error.options.cause);
        }
      } catch {
        // ignore
      }

      return undefined;
    },

  is:
    <T extends Constructable>(kind: T) =>
    (error: unknown): error is T => {
      return errors.as(kind)(error) !== undefined;
    },

  flat: (input: Error) => {
    const result = {
      name: input.name,
      message: input.message,
      stack: input.stack,
      context: {},
    };

    if (!CoreError.is(input)) {
      return result;
    }

    result.context = { ...result.context, ...input.options.context };

    let error = input.options.cause;
    while (error) {
      result.stack += '\n';
      result.stack += error.stack ?? `${error.name}: ${error.message}\n\t...`;

      if (!CoreError.is(error)) {
        break;
      }

      result.context = { ...result.context, ...error.options.context };
      error = error.options.cause;
    }

    return result;
  },

  json: (input: Error) => {
    if (CoreError.is(input)) {
      return input.toJSON();
    }

    return errors.flat(input);
  },
};
