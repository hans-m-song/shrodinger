import { Test, TestingModule } from '@nestjs/testing';
import { PlaybookResolver } from '../playbook.resolver';
import { PlaybookModule } from '../playbook.module';
import { databaseConfig } from '../../database/database.config';
import { PlaybookCreationAttributes, PlaybookModel } from '../playbook.model';
import { DatabaseModule } from '../../database/database.module';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { PlaybookRunModel } from '../../playbook-run/playbook-run.model';

describe('PlaybookResolver', () => {
  let resolver: PlaybookResolver;
  let playbookModel: typeof PlaybookModel;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule.forRoot(), PlaybookModule],
    })
      .overrideProvider(databaseConfig.KEY)
      .useValue({ storage: ':memory:', synchronise: true })
      .compile();

    resolver = app.get<PlaybookResolver>(PlaybookResolver);
    expect(resolver).toBeDefined();

    playbookModel = app.get<typeof PlaybookModel>(getModelToken(PlaybookModel));
    expect(playbookModel).toBeDefined();
  });

  it('should list playbooks', async () => {
    // given
    const playbooks = await playbookModel.bulkCreate([
      { filepath: 'lorem', contents: 'lorem' },
      { filepath: 'ipsum', contents: 'ipsum' },
      { filepath: 'dolor', contents: 'dolor' },
      { filepath: 'amet', contents: 'amet' },
    ] satisfies PlaybookCreationAttributes[]);

    // when
    const response = resolver.playbooks({ limit: 10, offset: 0 });

    // then
    await expect(response).resolves.toMatchObject(playbooks);
  });
});
