import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';

@Controller('api/animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  // GET /api/animals
  @Get()
  async getAllAnimals() {
    return this.animalsService.findAll();
  }

  // POST /api/animals
  @Post()
  async createAnimal(@Body() createAnimalDto: CreateAnimalDto ) {
    return this.animalsService.createAnimal(createAnimalDto);
  }

  // POST /api/animals/:id/feed
  @Post(':id/feed')
  async feedAnimal(@Param('id') id: string): Promise<{ pigState: string }> {
    return this.animalsService.feedAnimal(id);
  }
}
