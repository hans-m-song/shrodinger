import { LoggerService } from '@nestjs/common';
import { inspect } from 'util';

const log =
  (context: string) =>
  (...args: any[]) => {
    console.log(
      `[${context}]`,
      ...args.map((arg) => inspect(arg, { depth: Infinity })),
    );
  };

export const mockLogger: LoggerService = {
  log: jest.fn(log('log')),
  error: jest.fn(log('error')),
  warn: jest.fn(log('warn')),
  debug: jest.fn(log('debug')),
  verbose: jest.fn(log('verbose')),
};
