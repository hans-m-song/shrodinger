import { Test, TestingModule } from '@nestjs/testing';
import { PlaybookResolver } from './playbook.resolver';
import { PlaybookService } from './playbook.service';

describe('PlaybookResolver', () => {
  let resolver: PlaybookResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaybookResolver,
        { provide: PlaybookService, useValue: jest.fn() },
      ],
    }).compile();

    resolver = module.get<PlaybookResolver>(PlaybookResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
