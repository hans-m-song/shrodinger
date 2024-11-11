import { inspect } from 'util';

let logging = false;

export const setLogging = (state: boolean) => {
  logging = state;
};

const log =
  (context: string) =>
  (...args: any[]) => {
    if (!logging) {
      return;
    }

    console.log(
      `[${context}]`,
      ...args.map((arg) => inspect(arg, { depth: Infinity })),
    );
  };

export const mockLogger = {
  log: jest.fn(log('log')),
  error: jest.fn(log('error')),
  warn: jest.fn(log('warn')),
  debug: jest.fn(log('debug')),
  verbose: jest.fn(log('verbose')),
};
