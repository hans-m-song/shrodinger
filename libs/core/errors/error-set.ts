import { ZodError } from 'zod';
import { InternalServerError, NotFoundError } from './http.error';
import { ValidationError } from './runtime.error';

export const createErrorSet = (kind: string) => {
  class Validation extends ValidationError {
    name = `${kind}ValidationError`;

    constructor(cause: ZodError, input?: unknown, opts?: Record<string, any>) {
      super(`Failed to validate ${kind}`, cause, input, opts);
    }
  }

  class NotFound extends NotFoundError {
    name = `${kind}NotFoundError`;

    constructor(opts?: Record<string, any>, cause?: Error) {
      super(`Failed to find ${kind}`, {
        cause,
        context: opts,
      });
    }
  }

  class List extends InternalServerError {
    name = `${kind}ListError`;

    constructor(opts?: Record<string, any>, cause?: Error) {
      super(`Failed to list ${kind}`, {
        cause,
        context: opts,
      });
    }
  }

  class Get extends InternalServerError {
    name = `${kind}GetError`;

    constructor(opts?: Record<string, any>, cause?: Error) {
      super(`Failed to get ${kind}`, {
        cause,
        context: opts,
      });
    }
  }

  class Remove extends InternalServerError {
    name = `${kind}RemoveError`;

    constructor(opts?: Record<string, any>, cause?: Error) {
      super(`Failed to remove ${kind}`, {
        cause,
        context: opts,
      });
    }
  }

  class Create extends InternalServerError {
    name = `${kind}CreateError`;

    constructor(opts?: Record<string, any>, cause?: Error) {
      super(`Failed to create ${kind}`, {
        cause,
        context: opts,
      });
    }
  }

  class Update extends InternalServerError {
    name = `${kind}UpdateError`;

    constructor(opts?: Record<string, any>, cause?: Error) {
      super(`Failed to update ${kind}`, {
        cause,
        context: opts,
      });
    }
  }

  return {
    Validation,
    NotFound,
    List,
    Get,
    Remove,
    Create,
    Update,
  };
};
