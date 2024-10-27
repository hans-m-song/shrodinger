import 'dotenv/config';
import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import init from './config/init';
import { Logger } from './logger';

async function bootstrap() {
  const logger = Logger.create('NestFactory');
  const app = await NestFactory.create(AppModule, {
    logger,
    cors: {
      origin: init.cors.allowedOrigins,
    },
  });

  app.enableShutdownHooks();

  logger.verbose(init);
  logger.log({ port: init.http.port }, 'starting server');

  await app.listen(init.http.port);
}

bootstrap();
