import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PlaybookModule } from '../playbook.module';
import { LoggerModule } from '../../logger';
import { Database, DatabaseModule } from '../../database';
import {
  DatabaseHelpers,
  createDatabaseHelpers,
} from '../../../test/database-helpers';
import { CreatePlaybookAttributes } from '@shrodinger/contracts';
import { DATABASE_TOKEN } from '../../database/database.constants';
import { PlaybookRunModule } from '../../playbook-run/playbook-run.module';
import { databaseConfig } from '../../database/database.config';
import { INestApplication } from '@nestjs/common';

describe('PlaybookController', () => {
  let helpers: DatabaseHelpers;
  let app: INestApplication;
  let db: Database;

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
  });

  afterEach(async () => {
    await app.close();
    await helpers.database.cleanup();
  });

  it('should list playbooks', async () => {
    // given
    const playbooks = await helpers.playbooks.seed(10);

    // when
    const response = await request(app.getHttpServer())
      .get('/playbooks')
      .query({ limit: 3, offset: 0 });

    // then
    expect(response.body).toMatchObject({
      data: playbooks.attributes.slice(0, 3),
    });
  });

  it('should list playbooks by filepath', async () => {
    // given
    const playbooks = await helpers.playbooks.seed(10);
    const playbook = playbooks.attributes[1];

    // when
    const response = await request(app.getHttpServer())
      .get('/playbooks')
      .query({ filepath: playbook.filepath, limit: 1, offset: 0 });

    // then
    expect(response.body).toMatchObject({
      data: [playbook],
    });
  });

  it('should create a playbook', async () => {
    // given
    const playbook: CreatePlaybookAttributes = {
      filepath: 'foo.yaml',
      contents: { foo: 'bar' },
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/playbooks')
      .send(playbook);

    // then
    expect(response.body).toMatchObject({
      data: {
        playbookId: expect.any(Number),
        ...playbook,
      },
    });
  });
});
