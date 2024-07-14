import 'dotenv/config';
import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import init from './config/init';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(init.http.port);
}
bootstrap();
