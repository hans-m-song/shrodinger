import { Test, TestingModule } from '@nestjs/testing';
import { PlaybookController } from './playbook.controller';
import { PlaybookService } from './playbook.service';

describe('PlaybookController', () => {
  let controller: PlaybookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaybookController],
      providers: [{ provide: PlaybookService, useValue: jest.fn() }],
    }).compile();

    controller = module.get<PlaybookController>(PlaybookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
