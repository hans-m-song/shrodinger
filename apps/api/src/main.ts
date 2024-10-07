import 'dotenv/config';
import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import init, { logLevels } from './config/init';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logLevels.slice(logLevels.indexOf(init.meta.logLevel)),
    cors: {
      origin: init.cors.allowedOrigins,
    },
  });

  const logger = new Logger(AppModule.name);
  logger.log(init);

  await app.listen(init.http.port);
}

bootstrap();
