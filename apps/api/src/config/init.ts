import { LogLevel } from '@nestjs/common';
import { z } from 'zod';

export const logLevels = [
  'verbose',
  'debug',
  'log',
  'warn',
  'error',
  'fatal',
] as const satisfies LogLevel[];

export default {
  meta: {
    sha: z.string().default('unknown').parse(process.env.GIT_SHA),
    debug: z
      .boolean()
      .default(false)
      .parse(process.env.DEBUG === 'true'),
    logLevel: z.enum(logLevels).default('warn').parse(process.env.LOG_LEVEL),
  },
  http: {
    port: z.coerce
      .number()
      .int()
      .gt(1000)
      .default(3000)
      .parse(process.env.HTTP_PORT),
  },
  cors: {
    allowedOrigins: z
      .string()
      .url()
      .array()
      .optional()
      .parse(process.env.CORS_ALLOWED_ORIGINS?.split(',')),
  },
};
