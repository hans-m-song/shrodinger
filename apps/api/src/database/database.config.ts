import { z } from 'zod';
import { registerAs } from '@nestjs/config';
import { DATABASE_CONFIG_TOKEN } from './database.constants';

export const databaseConfig = registerAs(DATABASE_CONFIG_TOKEN, () =>
  z
    .object({
      storage: z.string().default(':memory:'),
      synchronize: z.boolean().default(false),
    })
    .parse({
      storage: process.env.DATABASE_STORAGE,
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
);

export type DatabaseConfig = ReturnType<typeof databaseConfig>;
