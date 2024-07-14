import { Test, TestingModule } from '@nestjs/testing';
import { PlaybookService } from './playbook.service';
import { getModelToken } from '@nestjs/sequelize';
import { Playbook } from './playbook.model';

describe('PlaybookService', () => {
  let service: PlaybookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaybookService,
        { provide: getModelToken(Playbook), useValue: jest.fn() },
      ],
    }).compile();

    service = module.get<PlaybookService>(PlaybookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
