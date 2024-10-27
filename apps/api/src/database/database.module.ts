import { DynamicModule, Inject, Module, Provider } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_TOKEN } from './database.constants';
import { Logger } from '../logger/logger.service';
import * as schema from './schema';
import { Pool } from 'pg';
import { getLoggerToken } from '../logger';
import { DatabaseConnectionModule } from './database-connection.module';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export const InjectDatabase = () => Inject(DATABASE_TOKEN);

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    const databaseProvider: Provider = {
      provide: DATABASE_TOKEN,
      inject: [getLoggerToken(DatabaseModule.name), Pool],
      useFactory: async (logger: Logger, pool: Pool) => {
        const db = drizzle<typeof schema>({
          client: pool,
          casing: 'snake_case',
          logger: {
            logQuery(query, params) {
              logger.verbose({ query, params });
            },
          },
        });

        return db;
      },
    };

    return {
      module: DatabaseModule,
      imports: [DatabaseConnectionModule.register()],
      providers: [databaseProvider],
      exports: [databaseProvider],
    };
  }
}
