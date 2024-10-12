import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleDestroy,
  OnModuleInit,
  Provider,
} from '@nestjs/common';
import { DatabaseConfig, databaseConfig } from './database.config';
import { ConfigModule } from '@nestjs/config';
import { ModelCtor, Sequelize } from 'sequelize-typescript';
import { CoreError } from '@shrodinger/core/errors';
import { DATABASE_MODEL_CACHE_TOKEN } from './database.constants';
import { InjectLogger } from '../logger/logger.module';
import { Logger } from '../logger/logger.service';

export type DatabaseModelCache = Set<ModelCtor>;

@Global()
@Module({})
export class DatabaseCoreModule implements OnModuleInit, OnModuleDestroy {
  static forRoot(): DynamicModule {
    const modelCacheProvider: Provider = {
      provide: DATABASE_MODEL_CACHE_TOKEN,
      useValue: new Set<ModelCtor>(),
    };

    const connectionProvider: Provider = {
      provide: Sequelize,
      inject: [databaseConfig.KEY],
      useFactory: async (config: DatabaseConfig) => {
        const logger = Logger.create(Sequelize.name);

        return new Sequelize({
          dialect: 'sqlite',
          dialectOptions: {
            foreignKeys: true,
          },

          storage: config.storage,
          define: {
            timestamps: false,
            underscored: true,
          },

          sync: {
            force: false,
            alter: true,
          },

          benchmark: true,
          logging: (sql, timing) => {
            logger.verbose(sql, { timing });
          },
        });
      },
    };

    return {
      module: DatabaseCoreModule,
      imports: [ConfigModule.forFeature(databaseConfig)],
      providers: [modelCacheProvider, connectionProvider],
      exports: [modelCacheProvider, connectionProvider],
    };
  }

  constructor(
    @InjectLogger(DatabaseCoreModule.name)
    private readonly logger: Logger,
    @Inject(DATABASE_MODEL_CACHE_TOKEN)
    private readonly modelCache: DatabaseModelCache,
    // @Inject(DATABASE_CONNECTION_TOKEN)
    private readonly sequelize: Sequelize,
    @Inject(databaseConfig.KEY)
    private readonly config: DatabaseConfig,
  ) {}

  async onModuleInit() {
    const models = Array.from(this.modelCache.values());
    this.sequelize.addModels(models as ModelCtor[]);

    this.logger.debug('initialising database connection', {
      host: this.sequelize.config.host,
      port: this.sequelize.config.port,
      models,
    });

    try {
      await this.sequelize.authenticate();
    } catch (error: any) {
      throw new CoreError('Failed to authenticate database connection', {
        cause: error,
      });
    }

    if (!this.config.synchronize) {
      return;
    }

    try {
      await this.sequelize.sync();
    } catch (error: any) {
      throw new CoreError('Failed to sync database schemas', {
        cause: error,
      });
    }
  }

  async onModuleDestroy() {
    this.logger.debug('closing database connection');

    try {
      await this.sequelize.close();
    } catch (error: any) {
      throw new CoreError('Failed to close database connection', {
        cause: error,
      });
    }
  }
}
