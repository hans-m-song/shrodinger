import 'dotenv/config';
import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import init from './config/init';
import { Logger } from './config/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(AppModule.name),
    cors: {
      origin: init.cors.allowedOrigins,
    },
  });

  const logger = new Logger(AppModule.name);
  logger.log(init);

  await app.listen(init.http.port);
}

bootstrap();
