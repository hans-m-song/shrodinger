import { z, ZodType } from 'zod';

export const IDSchema = z
  .number()
  .int()
  .min(0)
  .describe('Serial integer primary key ID');

export const EpochSchema = z
  .number()
  .int()
  .min(0)
  .describe('Unix epoch time in milliseconds');

export const VersionSchema = z
  .number()
  .int()
  .min(1)
  .describe('Record number of changes');

export const EpochRangeSchema = z
  .object({
    from: EpochSchema.optional(),
    to: EpochSchema.optional(),
  })
  .describe('Range of numbers, "from" is inclusive, "to" is exclusive')
  .refine(
    ({ from, to }) => {
      if (!from || !to) {
        return true;
      }

      return from < to;
    },
    { message: 'from must be less than to' },
  );
export const RangeSchema = z
  .object({
    from: z.number().int().min(0).optional(),
    to: z.number().int().min(1).optional(),
  })
  .describe('Range of numbers, "from" is inclusive, "to" is exclusive')
  .refine(
    ({ from, to }) => {
      if (!from || !to) {
        return true;
      }

      return from < to;
    },
    { message: 'from must be less than to' },
  );

export const PaginationSchema = z.object({
  limit: z.number().int().min(1).default(10),
  offset: z.number().int().min(0).default(0),
});

export const ActiveRecordSchema = z.object({
  version: z.number().int().min(1),
  createdAt: EpochSchema,
  updatedAt: EpochSchema,
});

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

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

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
