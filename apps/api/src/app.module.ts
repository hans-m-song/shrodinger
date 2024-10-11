import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PlaybookModule } from './playbook/playbook.module';
import { ConfigModule } from '@nestjs/config';
import init from './config/init';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseModels } from './database/models';
import { Logger } from './config/logger';

const logger = new Logger(SequelizeModule.name);

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      dialectOptions: {
        foreignKeys: true,
      },

      synchronize: true,
      autoLoadModels: true,
      storage: ':memory:',
      models: Object.values(databaseModels),
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
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, 'apps/api/src/schema.graphql'),
      debug: init.meta.debug,
      includeStacktraceInErrorResponses: false,
      hideSchemaDetailsFromClientErrors: true,
      status400ForVariableCoercionErrors: true,
      stopOnTerminationSignals: true,
    }),
    PlaybookModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
