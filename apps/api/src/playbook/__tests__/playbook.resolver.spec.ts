import { Test } from '@nestjs/testing';
import { PlaybookModule } from '../../playbook/playbook.module';
import { PlaybookResolver } from '../playbook.resolver';
import { Logger, LoggerModule } from '../../logger';
import { Database, DatabaseModule } from '../../database';
import {
  DatabaseHelpers,
  createDatabaseHelpers,
} from '../../../test/database-helpers';
import { DATABASE_TOKEN } from '../../database/database.constants';
import { PlaybookRunModule } from '../../playbook-run/playbook-run.module';
import { databaseConfig } from '../../database/database.config';
import { INestApplication } from '@nestjs/common';
import { mockLogger } from '../../../test/mocks/logger';

describe('PlaybookResolver', () => {
  let helpers: DatabaseHelpers;
  let app: INestApplication;
  let db: Database;
  let resolver: PlaybookResolver;

  beforeEach(async () => {
    helpers = await createDatabaseHelpers();

    const module = await Test.createTestingModule({
      imports: [
        LoggerModule.register(),
        DatabaseModule.register(),
        PlaybookRunModule,
        PlaybookModule,
      ],
    })
      .overrideProvider(Logger)
      .useValue(mockLogger)
      .overrideProvider(databaseConfig.KEY)
      .useValue(helpers.database.config)
      .compile();

    app = module.createNestApplication();
    await app.init();

    db = module.get<Database>(DATABASE_TOKEN);
    expect(db).toBeDefined();

    resolver = module.get<PlaybookResolver>(PlaybookResolver);
    expect(resolver).toBeDefined();
  });

  afterEach(async () => {
    await app.close();
    await helpers.database.cleanup();
  });

  it('should list playbooks', async () => {
    // given
    const playbooks = await helpers.playbooks.seed(10);

    // when
    const response = resolver.playbooks({ limit: 3, offset: 0 });

    // then
    await expect(response).resolves.toMatchObject(
      playbooks.attributes.slice(0, 3),
    );
  });

  it('should list playbooks by filepath', async () => {
    // given
    const playbooks = await helpers.playbooks.seed(10);
    const playbook = playbooks.attributes[0];

    // when
    const response = resolver.playbooks({
      filepath: playbook.filepath,
      limit: 1,
      offset: 0,
    });

    // then
    await expect(response).resolves.toMatchObject([playbook]);
  });

  it('should update a playbook', async () => {
    // given
    const {
      data: [playbook],
    } = await helpers.playbooks.seed(1);

    // when
    const response = resolver.updatePlaybook({
      playbookId: playbook.playbookId,
      active: true,
    });

    // then
    await expect(response).resolves.toMatchObject({
      ...playbook,
      version: 2,
      updatedAt: expect.any(Number),
    });
  });
});
