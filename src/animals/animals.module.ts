import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { Animal, AnimalSchema } from './schemas/animal.schema';
import { PigModule } from 'src/pig/pig.module';
import { PigService } from 'src/pig/pig.service';
import { PigImageStatus, PigImageStatusSchema } from 'src/pig/schemas/pig.schema';


@Module({
  imports: [
    PigModule,
    MongooseModule.forFeature([
      { name: Animal.name, schema: AnimalSchema },
      { name: PigImageStatus.name, schema: PigImageStatusSchema }
    ]),
  ],
  controllers: [AnimalsController],
  providers: [AnimalsService ],
  exports: [AnimalsService],
})
export class AnimalsModule {}
