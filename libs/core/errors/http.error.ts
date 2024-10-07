import { CoreError, CoreErrorOptions } from './core.error';

export class HttpError extends CoreError {
  name = 'HttpError';

  constructor(
    message: string,
    readonly statusCode: number,
    readonly responseText: string,
    readonly options: CoreErrorOptions = {},
  ) {
    super(message, {
      ...options,
      context: {
        ...options.context,
        statusCode,
        responseText,
      },
    });
  }

  toResponse() {
    return {
      statusCode: this.statusCode,
      body: {
        error: {
          message: this.responseText,
          code: this.options.context?.errorCode,
          detail: this.options.context?.errorDetail,
        },
      },
    };
  }
}

export class BadRequestError extends HttpError {
  name = 'BadRequestError';

  constructor(message: string, options?: CoreErrorOptions) {
    super(message, 400, 'Bad request', options);
  }
}

export class UnauthorizedError extends HttpError {
  name = 'UnauthorizedError';

  constructor(message: string, options?: CoreErrorOptions) {
    super(message, 401, 'Unauthorized', options);
  }
}

export class NotFoundError extends HttpError {
  name = 'NotFoundError';

  constructor(message: string, options?: CoreErrorOptions) {
    super(message, 404, 'Not found', options);
  }
}

export class InternalServerError extends HttpError {
  name = 'InternalServerError';

  constructor(message: string, options?: CoreErrorOptions) {
    super(message, 500, 'Internal server error', options);
  }
}