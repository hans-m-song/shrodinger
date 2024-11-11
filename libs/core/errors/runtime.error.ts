import { ZodError } from 'zod';
import { CoreError } from './core.error';
import { Errors } from './errors';

export class ValidationError extends CoreError {
  name = 'ValidationError';

  static isValidationError = Errors.is(ValidationError);

  constructor(
    message: string,
    cause: ZodError,
    input?: unknown,
    context?: Record<string, unknown>,
  ) {
    super(message, {
      cause: {
        name: cause.name,
        message: 'Schema validation failed',
        stack: cause.stack
          ?.split('\n')
          .filter((frame) => frame.trim().startsWith('at'))
          .join('\n'),
      },
      context: {
        input,
        issues: cause.issues,
        ...context,
      },
    });
  }
}

export class ParseError extends CoreError {
  name = 'ParseError';

  static isParseError = Errors.is(ParseError);

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
