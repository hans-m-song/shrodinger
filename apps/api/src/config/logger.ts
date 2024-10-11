import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { LogFormat } from './init';
import pino from 'pino';
import { CoreError } from '@shrodinger/core/errors';
import init from '../config/init';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
  instance: pino.Logger;

  static create(context: string) {
    return new Logger(context);
  }

  constructor(readonly context: string) {
    this.instance = pino({
      level: init.log.level,
      name: context,
      formatters: {
        level: (label) => ({ level: label }),
      },
      serializers: {
        error: (error) => {
          if (typeof error !== 'object' || error === null) {
            return error;
          }

          if (CoreError.is(error)) {
            return error.toJSON();
          }

          const { name, message, stack } = error;
          return { name, message, stack };
        },
      },
      transport:
        init.log.format === LogFormat.Json
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            },
    });
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.instance.trace({}, message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.instance.debug({}, message, ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]) {
    this.instance.info({}, message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.instance.warn({}, message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.instance.error({}, message, ...optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.instance.fatal({}, message, ...optionalParams);
  }
}
