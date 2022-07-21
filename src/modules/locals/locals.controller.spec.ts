import { Test, TestingModule } from '@nestjs/testing';
import { LocalsController } from './locals.controller';
import { LocalsService } from './locals.service';

describe('LocalsController', () => {
  let controller: LocalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalsController],
      providers: [LocalsService],
    }).compile();

    controller = module.get<LocalsController>(LocalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
