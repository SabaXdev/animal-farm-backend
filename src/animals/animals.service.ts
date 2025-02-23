import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Animal } from './schemas/animal.schema';
import { PigService } from '../pig/pig.service';
import { CreateAnimalDto } from './dto/create-animal.dto';

@Injectable()
export class AnimalsService {

  constructor(
    @InjectModel(Animal.name) private readonly animalModel: Model<Animal>, 
    private readonly pigService: PigService,
  ) {}

  async findAll(): Promise<Animal[]> {
    return this.animalModel.find().exec();
  }

  async createAnimal(createAnimalDto: CreateAnimalDto): Promise<Animal> {
    try {
      const imageUrl = this.getDefaultImage(createAnimalDto.type);

      const newAnimal = await this.animalModel.create({
        ...createAnimalDto,
        imageUrl,
      });
  
      if (createAnimalDto.type === 'Pig') {
        await this.pigService.handlePigCreation(newAnimal);
      }
  
      return newAnimal;
    } catch (error) {
      throw error;
    }
  }
  

  async feedAnimal(animalId: string): Promise<{ pigState: string }> {
    await this.animalModel.findByIdAndUpdate(animalId, { $inc: { thanks: 1 } });

    await this.animalModel.findOne({ type: 'Pig' }) || (() => { throw new Error('Pig not found!'); })();

    const pigState = await this.pigService.updatePigStatus('happy');
   
    return { pigState };
  }

  private getDefaultImage(type: string): string {
    const baseUrl = 'https://sabaxdev.github.io/animal-farm-frontend/assets/images/';
    const images: { [key: string]: string } = {
      Pig: 'ღორი_ჩვეულებრივი.jpg',
      Donkey: 'ვირი.jpg',
      Goat: 'თხა.jpg',
      Cow: 'ძროხა.jpg',
      Hen: 'მამალი.jpg',
      Raven: 'ყვავი.jpg',
      Horse: 'ცხენი.jpg',
      Sheep: 'ცხვარი.jpg',
      Dog: 'ძაღლი.jpg',
    };
    return baseUrl + (images[type] || 'default.jpg');
  }
}
