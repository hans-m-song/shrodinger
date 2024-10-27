import {
  DynamicModule,
  Global,
  Module,
  OnModuleDestroy,
  OnModuleInit,
  Provider,
} from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseConfig, databaseConfig } from './database.config';
import { getLoggerToken, InjectLogger, Logger } from '../logger';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({})
export class DatabaseConnectionModule implements OnModuleInit, OnModuleDestroy {
  static register(): DynamicModule {
    const connectionProvider: Provider = {
      provide: Pool,
      inject: [
        getLoggerToken(DatabaseConnectionModule.name),
        databaseConfig.KEY,
      ],
      useFactory: async (logger: Logger, config: DatabaseConfig) => {
        const pool = new Pool({
          ...config,
          log(...messages) {
            logger.verbose({ messages });
          },
        });

        return pool;
      },
    };

    return {
      module: DatabaseConnectionModule,
      imports: [ConfigModule.forFeature(databaseConfig)],
      providers: [connectionProvider],
      exports: [connectionProvider],
    };
  }

  constructor(
    @InjectLogger(DatabaseConnectionModule.name)
    private readonly logger: Logger,
    private readonly pool: Pool,
  ) {}

  async onModuleInit() {
    this.logger.verbose('checking connection');
    await this.pool.query('SELECT 1');
  }

  async onModuleDestroy() {
    this.logger.verbose('closing connection');
    await this.pool.end();
  }
}
