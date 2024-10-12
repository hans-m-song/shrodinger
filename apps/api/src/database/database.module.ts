import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DatabaseCoreModule, DatabaseModelCache } from './database-core.module';
import { ModelCtor } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';
import { DATABASE_MODEL_CACHE_TOKEN } from './database.constants';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [DatabaseCoreModule.forRoot()],
    };
  }

  static forFeature(models: ModelCtor[]): DynamicModule {
    const instances: Provider[] = models.map((model) => ({
      provide: getModelToken(model),
      inject: [DATABASE_MODEL_CACHE_TOKEN],
      useFactory: (cache: DatabaseModelCache) => {
        cache.add(model);
        return model;
      },
    }));

    return {
      module: DatabaseModule,
      providers: instances,
      exports: instances,
    };
  }
}
