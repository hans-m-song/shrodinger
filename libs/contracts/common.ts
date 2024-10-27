import { z, ZodType } from 'zod';

export const IDSchema = z.number().int().min(0);

export type ID = z.infer<typeof IDSchema>;

export const ResponseSchema = (data: ZodType) =>
  z.object({
    data,
  });

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string().optional(),
    message: z.string(),
    detail: z.any().optional(),
  }),
});

export const commonResponses = {
  400: ErrorResponseSchema,
  401: ErrorResponseSchema,
  403: ErrorResponseSchema,
  404: ErrorResponseSchema,
  500: ErrorResponseSchema,
} as const;

export const defaultResponse = {
  400: {
    status: 400,
    body: { error: { message: 'Bad request' } },
  },
  401: {
    status: 401,
    body: { error: { message: 'Unauthorised' } },
  },
  403: {
    status: 403,
    body: { error: { message: 'Forbidden' } },
  },
  404: {
    status: 404,
    body: { error: { message: 'Not found' } },
  },
  500: {
    status: 500,
    body: { error: { message: 'Internal Server Error' } },
  },
} as const;
