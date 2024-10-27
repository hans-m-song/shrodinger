import { z } from 'zod';
import { registerAs } from '@nestjs/config';
import { DATABASE_CONFIG_TOKEN } from './database.constants';

export const DatabasConfigSchema = z.object({
  database: z.string().default('postgres'),
  host: z.string().default('localhost'),
  port: z.number().int().default(5432),
  user: z.string().default('postgres'),
  password: z.string().default('postgres'),
  ssl: z.boolean().default(true),
});

export const databaseConfig = registerAs(DATABASE_CONFIG_TOKEN, () =>
  DatabasConfigSchema.parse({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: process.env.DATABASE_SSL !== 'false',
  }),
);

export type DatabaseConfig = ReturnType<typeof databaseConfig>;
