import {
  DynamicModule,
  Global,
  Inject,
  Module,
  Provider,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_TOKEN } from './database.constants';
import { Logger } from '@/logger/logger.service';
import * as schema from './schema';
import { databaseConfig, DatabaseConfig } from './database.config';
import { ConfigModule } from '@nestjs/config';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export const InjectDatabase = () => Inject(DATABASE_TOKEN);

@Global()
@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    const databaseProvider: Provider = {
      provide: DATABASE_TOKEN,
      inject: [databaseConfig.KEY],
      useFactory: async (config: DatabaseConfig) => {
        const logger = Logger.create(DatabaseModule.name);

        const db = drizzle<typeof schema>({
          casing: 'snake_case',
          logger: {
            logQuery: (query, params) => {
              logger.verbose({ query, params });
            },
          },
          connection: {
            ...config,
            log(...messages) {
              logger.verbose({ messages });
            },
          },
        });

        logger.verbose('checking connection');
        await db.execute('SELECT 1');

        return db;
      },
    };

    return {
      module: DatabaseModule,
      imports: [ConfigModule.forFeature(databaseConfig)],
      providers: [databaseProvider],
      exports: [databaseProvider],
    };
  }
}
