import { Errors } from './errors';

export interface CoreErrorOptions {
  context?: Record<string, unknown>;
  cause?: Error;
}

export class CoreError extends Error {
  name = 'CoreError';

  static isCoreError = Errors.is(CoreError);

  constructor(
    message: string,
    readonly options?: CoreErrorOptions,
  ) {
    super(message);
  }

  get cause() {
    return this.options?.cause;
  }

  get context() {
    return this.options?.context;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: stripStack(this.stack),
      context: this.options?.context,
      cause: Errors.is(CoreError)(this?.cause)
        ? this.cause.toJSON()
        : {
            name: this.options?.cause?.name,
            message: this.options?.cause?.message,
            stack: stripStack(this.options?.cause?.stack),
          },
    };
  }
}

const stripStack = (stack?: string) =>
  stack
    ?.split('\n')
    .slice(1)
    .filter((line) => !line.includes('node_modules'))
    .filter((line) => !line.includes('node:internal'))
    .map((line) => line.trim())
    .join('\n');
