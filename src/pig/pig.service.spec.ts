import { Test, TestingModule } from '@nestjs/testing';
import { PigService } from './pig.service';
import { Model } from 'mongoose';
import { PigImageStatus } from './schemas/pig.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Animal } from 'src/animals/schemas/animal.schema';

const mockPigImageStatus = {
  findOne: jest.fn(),
  updateOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn().mockResolvedValue({ _id: 'mockedId', current_status: 'neutral' }),
};

describe('PigService', () => {
  let service: PigService;
  let pigImageStatusModel: Model<PigImageStatus>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PigService,
        {
          provide: getModelToken(PigImageStatus.name),
          useValue: mockPigImageStatus,
        },
      ],
    }).compile();

    service = module.get<PigService>(PigService);
    pigImageStatusModel = module.get<Model<PigImageStatus>>(getModelToken(PigImageStatus.name));

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPigState', () => {
    it('should return the current pig state', async () => {
      mockPigImageStatus.findOne.mockResolvedValue({ current_status: 'happy' });

      const result = await service.getPigState();
      expect(result).toBe('happy');
      expect(mockPigImageStatus.findOne).toHaveBeenCalled();
    });

    it('should throw an error if no pig state is found', async () => {
      mockPigImageStatus.findOne.mockResolvedValue(null);
      await expect(service.getPigState()).rejects.toThrow('Pig state not found');
    });
  });

  describe('updatePigStatus', () => {
    it('should update the pig status and return the new status', async () => {
      mockPigImageStatus.updateOne.mockResolvedValue({});
      jest.spyOn(service as any, 'getCurrentPigStatus').mockResolvedValue('happy');

      const result = await service.updatePigStatus('happy');
      expect(result).toBe('happy');
      expect(mockPigImageStatus.updateOne).toHaveBeenCalledWith(
        {},
        { $set: { current_status: 'happy', updated_at: expect.any(Date) } }
      );
    });
  });

  describe('handlePigCreation', () => {
    it('should create a pig entry when a pig is created', async () => {
      const animal: Animal = { _id: '123', name: 'Napoleon', type: 'Pig' } as Animal;
      mockPigImageStatus.save.mockResolvedValue({});

      await service.handlePigCreation(animal);

      expect(mockPigImageStatus.create).toHaveBeenCalled();
    });
  });

  describe('triggerPutinState', () => {
    it('should toggle the pig state between "putin" and "home"', async () => {
      mockPigImageStatus.findOne.mockResolvedValue({ current_status: 'putin' });
      mockPigImageStatus.updateOne.mockResolvedValue({});

      const result = await service.triggerPutinState();
      expect(result).toBe('home');
      expect(mockPigImageStatus.updateOne).toHaveBeenCalledWith({}, { state: 'home' });
    });
  });


});
