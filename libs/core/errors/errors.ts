type constructable = abstract new (...args: any) => any;

export namespace Errors {
  export const hasCause = (input: unknown): input is { cause: unknown } =>
    typeof input === 'object' && input !== null && 'cause' in input;

  export const hasContext = (
    input: unknown,
  ): input is { context: Record<string, unknown> } =>
    typeof input === 'object' &&
    input !== null &&
    'context' in input &&
    typeof input.context === 'object' &&
    input.context !== null;

  export const as =
    <T extends constructable>(kind: T) =>
    (error: unknown): InstanceType<T> | undefined => {
      if (typeof error !== 'object' || error === null) {
        return undefined;
      }

      if (error instanceof kind) {
        return error as InstanceType<T>;
      }

      if (hasCause(error)) {
        return Errors.as(kind)(error.cause);
      }

      return undefined;
    };

  export const is =
    <T extends constructable>(kind: T) =>
    (error: unknown): error is InstanceType<T> =>
      Errors.as(kind)(error) !== undefined;

  export interface FlatError {
    name: string;
    message: string;
    stack?: string;
    context?: Record<string, unknown>;
    cause?: unknown;
  }

  export const flat = (input: unknown): FlatError => {
    if (typeof input !== 'object' || !(input instanceof Error)) {
      return {
        name: 'Unknown',
        message: 'Unknown',
        cause: input,
      };
    }

    const result: FlatError = {
      name: input.name,
      message: input.message,
      stack: input.stack,
    };

    if (!hasCause(input)) {
      return result;
    }

    let error = input.cause;
    while (error) {
      if (!(error instanceof Error)) {
        result.cause = error;
        break;
      }

      result.stack += '\n';
      result.stack += error.stack ?? `${error.name}: ${error.message}\n\t...`;

      if (hasContext(error)) {
        result.context = { ...result.context, ...error.context };
      }

      if (!hasCause(error)) {
        break;
      }

      error = error.cause;
    }

    return result;
  };
}
