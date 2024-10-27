import { Injectable, LoggerService } from '@nestjs/common';
import init, { LogFormat } from '../config/init';
import { Logger as NestjsLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class Logger implements LoggerService {
  instance: NestjsLogger;

  static create(context = '') {
    return new Logger(context);
  }

  constructor(readonly context: string) {
    this.instance = new NestjsLogger(
      new PinoLogger({
        renameContext: 'name',
        pinoHttp: {
          level: init.log.level,
          formatters: {
            level: (label) => ({ level: label }),
          },
          serializers: {
            req: (req: any) => ({
              id: req.id,
              method: req.method,
              url: req.url,
              params: req.params,
            }),
            res: (res: any) => ({
              code: res.statusCode,
            }),
            err: (error: any): any => {
              if (typeof error !== 'object' || error === null) {
                return error;
              }

              if ('toJSON' in error && typeof error.toJSON === 'function') {
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
                    ignore: 'pid,hostname',
                    colorize: !init.meta.ci,
                  },
                },
        },
      }),
      { renameContext: 'name' },
    );
  }

  verbose(message: string | object, ...optionalParams: any[]) {
    this.instance.verbose(message, ...optionalParams);
  }

  debug(message: string | object, ...optionalParams: any[]) {
    this.instance.debug(message, ...optionalParams);
  }

  log(message: string | object, ...optionalParams: any[]) {
    this.instance.log(message, ...optionalParams);
  }

  warn(message: string | object, ...optionalParams: any[]) {
    this.instance.warn(message, ...optionalParams);
  }

  error(message: string | object, ...optionalParams: any[]) {
    this.instance.error(message, ...optionalParams);
  }

  fatal(message: string | object, ...optionalParams: any[]) {
    this.instance.fatal(message, ...optionalParams);
  }
}
