import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsService } from './animals.service';
import { PigService } from '../pig/pig.service';
import { getModelToken } from '@nestjs/mongoose';
import { Animal } from './schemas/animal.schema';
import { CreateAnimalDto } from './dto/create-animal.dto';

describe('AnimalsService', () => {
  let service: AnimalsService;
  let pigService: PigService;
  let animalModel: any;

  const mockPigService = {
    handlePigCreation: jest.fn(),
    updatePigStatus: jest.fn().mockResolvedValue('happy'),
  };

  const mockAnimalModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([{ type: 'Pig', name: 'Napoleon' }])
    }),
    save: jest.fn().mockResolvedValue({ type: 'Pig', name: 'Napoleon' }),
    findByIdAndUpdate: jest.fn().mockResolvedValue({ thanks: 1 }),
    findOne: jest.fn(),
    create: jest.fn(),
  };
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsService,
        { provide: PigService, useValue: mockPigService },
        { provide: getModelToken(Animal.name), useValue: mockAnimalModel },
      ],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
    pigService = module.get<PigService>(PigService);
    animalModel = module.get(getModelToken(Animal.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of animals', async () => {
      const result = await service.findAll();
      expect(result).toEqual([{ name: 'Napoleon', type: 'Pig' }]
        
      );
      expect(animalModel.find).toHaveBeenCalled();
    });
  });

  describe('createAnimal', () => {
    it('should create and return a new animal', async () => {
      const createAnimalDto: CreateAnimalDto = { name: 'Napoleon', type: 'Pig' };
      const imageUrl = 'http://localhost:4200/ღორი_ჩვეულებრივი.jpg';
      const savedAnimal = { ...createAnimalDto, imageUrl, _id: '1' };
      
      mockAnimalModel.create.mockResolvedValue(savedAnimal);

      const result = await service.createAnimal(createAnimalDto);

      // Assertions
      expect(result).toEqual(savedAnimal);
      expect(mockAnimalModel.create).toHaveBeenCalledWith({...createAnimalDto, imageUrl});
      expect(mockPigService.handlePigCreation).toHaveBeenCalledWith(savedAnimal);
    });

    it('should create an animal with the default image', async () => {
      const createAnimalDto: CreateAnimalDto = { name: 'Napoleon', type: 'Pig' };
      const result = await service.createAnimal(createAnimalDto);
      const imageUrl = 'http://localhost:4200/ღორი_ჩვეულებრივი.jpg';
      expect(result.imageUrl).toBe(imageUrl);
    });
  });

  describe('feedAnimal', () => {
    it('should feed an animal and update pig status', async () => {
      const animalId = '1';
      mockAnimalModel.findOne.mockResolvedValueOnce({ type: 'Pig' });
      const result = await service.feedAnimal(animalId);

      // Assertions
      expect(result).toEqual({ pigState: 'happy' });
      expect(animalModel.findByIdAndUpdate).toHaveBeenCalledWith(animalId, { $inc: { thanks: 1 } });
      expect(pigService.updatePigStatus).toHaveBeenCalledWith('happy');
    });

    it('should throw error if pig is not found', async () => {
      jest.spyOn(animalModel, 'findOne').mockResolvedValueOnce(null);

      try {
        await service.feedAnimal('1');
      } catch (error) {
        expect(error.message).toBe('Pig not found!');
      }
    });
  });

  describe('getDefaultImage', () => {
    it('should return the correct image URL for Pig', () => {
      const imageUrl = service['getDefaultImage']('Pig');
      expect(imageUrl).toBe('http://localhost:4200/ღორი_ჩვეულებრივი.jpg');
    });

    it('should return a default image for unknown type', () => {
      const imageUrl = service['getDefaultImage']('Unknown');
      expect(imageUrl).toBe('http://localhost:4200/default.jpg');
    });
  });
});
