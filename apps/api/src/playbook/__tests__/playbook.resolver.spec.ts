import { Test } from '@nestjs/testing';
import { PlaybookModule } from '../../playbook/playbook.module';
import { PlaybookResolver } from '../playbook.resolver';
import { LoggerModule } from '../../logger';
import { Database, DatabaseModule, playbooks } from '../../database';
import {
  DatabaseHelpers,
  createDatabaseHelpers,
} from '../../../test/database-helpers';
import { CreatePlaybookAttributes } from '@shrodinger/contracts';
import { DATABASE_TOKEN } from '../../database/database.constants';
import { PlaybookRunModule } from '../../playbook-run/playbook-run.module';
import { databaseConfig } from '../../database/database.config';
import { INestApplication } from '@nestjs/common';

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

  it('should create a playbook', async () => {
    // given
    const playbook: CreatePlaybookAttributes = {
      filepath: 'foo.yaml',
      contents: { foo: 'bar' },
    };

    // when
    const response = resolver.createPlaybook(playbook);

    // then
    await expect(response).resolves.toMatchObject({
      playbookId: expect.any(Number),
      ...playbook,
    });
  });

  it('should update a playbook', async () => {
    // given
    const {
      data: [playbook],
    } = await helpers.playbooks.seed(1);

    // when
    const response = resolver.updatePlaybook({
      playbookId: playbook.playbookId,
      contents: { foo: 'bar' },
    });

    // then
    await expect(response).resolves.toMatchObject({
      ...playbook,
      contents: { foo: 'bar' },
      updatedAt: expect.closeTo(Date.now(), 4),
    });
  });

  it('should delete a playbook', async () => {
    // given
    const {
      data: [playbook],
    } = await helpers.playbooks.seed(10);

    // when
    const response = resolver.deletePlaybook({
      playbookId: playbook.playbookId,
    });

    // then
    await expect(response).resolves.toBeUndefined();
    await expect(db.select().from(playbooks)).resolves.not.toMatchObject([
      playbook,
    ]);
  });
});
