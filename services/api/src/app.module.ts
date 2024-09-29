import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlaybookModule } from './playbook/playbook.module';
import init from './config/init';
import { PlaybookRunModule } from './playbook-run/playbook-run.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      retryAttempts: 0,
      logging(sql) {
        console.log('[sql]', sql);
      },
      autoLoadModels: true,
      synchronize: true,
      ...init.database,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    PlaybookModule,
    PlaybookRunModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
