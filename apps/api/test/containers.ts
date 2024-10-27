import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { DatabaseConfig } from '../src/database/database.config';

export class PostgresContainer {
  static instance?: PostgresContainer;

  private static IMAGE = 'postgres:17';
  private static PORT = 5432;
  private static DATABASE = 'test';
  private static USERNAME = 'test';
  private static PASSWORD = 'test';

  private constructor(public readonly container: StartedPostgreSqlContainer) {}

  static async get() {
    if (!PostgresContainer.instance) {
      const container = await new PostgreSqlContainer(PostgresContainer.IMAGE)
        .withDatabase(PostgresContainer.DATABASE)
        .withUsername(PostgresContainer.USERNAME)
        .withPassword(PostgresContainer.PASSWORD)
        .withExposedPorts(PostgresContainer.PORT)
        .start();

      PostgresContainer.instance = new PostgresContainer(container);
    }

    return PostgresContainer.instance;
  }

  async stop() {
    await this.container.stop({
      remove: true,
      removeVolumes: true,
    });
  }

  config(): DatabaseConfig {
    return {
      database: this.container.getDatabase(),
      host: this.container.getHost(),
      port: this.container.getMappedPort(PostgresContainer.PORT),
      user: PostgresContainer.USERNAME,
      password: PostgresContainer.PASSWORD,
      ssl: false,
    };
  }
}
