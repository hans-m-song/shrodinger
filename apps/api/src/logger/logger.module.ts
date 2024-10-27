import {
  DynamicModule,
  Global,
  Inject,
  Module,
  Provider,
} from '@nestjs/common';
import { Logger } from './logger.service';
import { LOGGER_TOKEN } from './logger.constants';

const injected = new Set<string>();

export const getLoggerToken = (context = '') => {
  injected.add(context);
  return context ? `${LOGGER_TOKEN}.${context}` : LOGGER_TOKEN;
};

export const InjectLogger = (context = '') => {
  return Inject(getLoggerToken(context));
};

@Global()
@Module({})
export class LoggerModule {
  static register(): DynamicModule {
    const rootLoggerProvider: Provider = {
      provide: getLoggerToken(),
      useValue: Logger.create(),
    };

    const injectedLoggerProviders: Provider[] = Array.from(injected).map(
      (context) => ({
        provide: getLoggerToken(context),
        useValue: Logger.create(context),
      }),
    );

    return {
      module: LoggerModule,
      providers: [rootLoggerProvider, ...injectedLoggerProviders],
      exports: [rootLoggerProvider, ...injectedLoggerProviders],
    };
  }
}
