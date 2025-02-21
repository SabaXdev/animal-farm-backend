import { Module } from '@nestjs/common';
import { PigController } from './pig.controller';
import { PigService } from './pig.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PigImageStatus, PigImageStatusSchema } from './schemas/pig.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PigImageStatus.name, schema: PigImageStatusSchema },
    ]),
  ],
  controllers: [PigController],
  providers: [PigService],
  exports: [PigService],
})
export class PigModule {}
