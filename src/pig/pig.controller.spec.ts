import { Test, TestingModule } from '@nestjs/testing';
import { PigController } from './pig.controller';
import { PigService } from './pig.service';

describe('PigController', () => {
  let controller: PigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PigController],
      providers: [PigService,       {
        provide: 'PigImageStatusModel',
        useValue: {},
      },],
    }).compile();

    controller = module.get<PigController>(PigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
