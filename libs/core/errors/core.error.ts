import { ZodError } from 'zod';

export interface CoreErrorOptions {
  context?: Record<string, unknown>;
  cause?: Error;
}

export class CoreError extends Error {
  name = 'CoreError';

  constructor(
    message: string,
    readonly options: CoreErrorOptions,
  ) {
    super(message);
  }

  get cause() {
    return this.options.cause;
  }

  static is(error: unknown): error is CoreError {
    try {
      return error instanceof CoreError;
    } catch {
      return false;
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      context: this.options.context,
      cause: CoreError.is(this.options.cause)
        ? this.options.cause.toJSON()
        : {
            name: this.options.cause?.name,
            message: this.options.cause?.message,
            stack: this.options.cause?.stack,
          },
    };
  }
}

export class ValidationException extends CoreError {
  name = 'ValidationException';

  constructor(
    cause: ZodError,
    input?: unknown,
    context?: Record<string, unknown>,
  ) {
    super('Schema validation failed', {
      cause,
      context: {
        input,
        issues: cause.issues,
        ...context,
      },
    });
  }
}

export class ParseException extends CoreError {
  name = 'ParseException';

  constructor(
    cause: Error,
    input?: unknown,
    context?: Record<string, unknown>,
  ) {
    super('Parse failed', {
      cause,
      context: {
        input,
        ...context,
      },
    });
  }
}
