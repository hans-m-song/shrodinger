import { playbooks } from '../src/database';
import { DatabaseConfig } from '../src/database/database.config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { PostgresContainer } from './containers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Logger } from '../src/logger';
import { randomUUID } from 'crypto';
import { Client } from 'pg';
import * as schema from '../src/database/schema';
import { resolve } from 'path';

export type DatabaseHelpers = Awaited<ReturnType<typeof createDatabaseHelpers>>;

export const createDatabaseHelpers = async () => {
  const logger = Logger.create('DatabaseHelpers');

  const container = await PostgresContainer.get();
  const database = `test_${randomUUID().replace(/-/g, '_')}`;

  logger.debug(`creating database ${database}`);
  const client = new Client(container.config());
  await client.connect();
  await client.query(`CREATE DATABASE ${database}`);

  const config: DatabaseConfig = {
    ...container.config(),
    database,
  };

  const db = drizzle<typeof schema>({
    casing: 'snake_case',
    logger: {
      logQuery(query, params) {
        logger.verbose({ query, params });
      },
    },
    connection: {
      ...config,
      log(...messages) {
        logger.verbose({ messages });
      },
    },
  });

  await migrate(db, { migrationsFolder: resolve(__dirname, '..', 'drizzle') });

  return {
    database: {
      db,
      config,

      reset: async () => {
        for (const table of Object.keys(db.query)) {
          await db.execute(`TRUNCATE TABLE ${table} CASCADE;`);
        }
      },
      cleanup: async () => {
        await db.$client.end();
        // await client.query(`DROP DATABASE ${databaseName}`);
        await client.end();
      },
    },

    playbooks: {
      seed: async (count: number) => {
        const attributes = Array(count)
          .fill(0)
          .map((_, i) => ({
            playbookId: i + 1,
            filepath: `playbook-${i + 1}.yaml`,
            contents: { name: `Playbook ${i + 1}` },
          }));

        const data = await db.insert(playbooks).values(attributes).returning();

        return { attributes, data };
      },
    },
  };
};