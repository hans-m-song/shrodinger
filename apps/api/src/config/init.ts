import { z } from 'zod';

export enum LogLevel {
  Trace = 'trace',
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Fatal = 'fatal',
}

export enum LogFormat {
  Json = 'json',
  Text = 'text',
}

export default {
  meta: {
    sha: z.string().default('unknown').parse(process.env.GIT_SHA),
    debug: process.env.DEBUG === 'true',
    ci: 'GITHUB_ACTION' in process.env,
  },
  log: {
    level: z
      .nativeEnum(LogLevel)
      .default(LogLevel.Warn)
      .parse(process.env.LOG_LEVEL),
    format: z
      .nativeEnum(LogFormat)
      .default(LogFormat.Json)
      .parse(process.env.LOG_FORMAT),
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
