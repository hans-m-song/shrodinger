import { defineConfig } from 'drizzle-kit';
import { DatabasConfigSchema } from './src/database/database.config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  verbose: true,
  dbCredentials: DatabasConfigSchema.parse({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: process.env.DATABASE_SSL !== 'false',
  }),
});
