import { ZodError } from 'zod';
import { InternalServerError, NotFoundError } from './http.error';

export const createErrorSet = (kind: string) => {
  class NotFound extends NotFoundError {
    name = `${kind}NotFoundError`;

    constructor(opts?: Record<string, any>, cause?: Error) {
      super(`${kind} not found`, {
        context: opts,
        cause,
      });
    }
  }

  class Validation extends InternalServerError {
    name = `${kind}ValidationError`;

    constructor(cause: ZodError, input: unknown) {
      super(`Failed to validate ${kind} against schema`, {
        cause,
        context: { input, issues: cause.issues },
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
    NotFound,
    Validation,
    List,
    Get,
    Remove,
    Create,
    Update,
  };
};
