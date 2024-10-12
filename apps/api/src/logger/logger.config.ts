import { z } from 'zod';
import { registerAs } from '@nestjs/config';
import { LOGGER_CONFIG_TOKEN } from './logger.constants';

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

export const loggerConfig = registerAs(LOGGER_CONFIG_TOKEN, () => ({
  level: z
    .nativeEnum(LogLevel)
    .default(LogLevel.Warn)
    .parse(process.env.LOG_LEVEL),
  format: z
    .nativeEnum(LogFormat)
    .default(LogFormat.Json)
    .parse(process.env.LOG_FORMAT),
  ci: process.env.CI === 'true' || !!process.env.GITHUB_ACTIONS,
}));

export type LoggerConfig = ReturnType<typeof loggerConfig>;
