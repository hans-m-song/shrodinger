import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { PlaybookModule } from './playbook/playbook.module';
import { PlaybookRunModule } from './playbook-run/playbook-run.module';
import { LoggerModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import init from './config/init';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PlaybookRunLogModule } from './playbook-run-log/playbook-run-log.module';

const externalModules = [
  LoggerModule.register(),
  DatabaseModule.register(),
  GraphQLModule.forRoot({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'schema.graphql'),
    debug: init.meta.debug,
    includeStacktraceInErrorResponses: init.meta.debug,
    hideSchemaDetailsFromClientErrors: !init.meta.debug,
    status400ForVariableCoercionErrors: true,
    stopOnTerminationSignals: true,
    playground: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  }),
];

const internalModules = [
  PlaybookModule,
  PlaybookRunModule,
  PlaybookRunLogModule,
];

@Module({
  imports: [...externalModules, ...internalModules],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
