import { Injectable } from '@nestjs/common';
import { PigImageStatus } from './schemas/pig.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Animal } from 'src/animals/schemas/animal.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class PigService {
    constructor(
        @InjectModel(PigImageStatus.name) private readonly pigImageStatus: Model<PigImageStatus>,
    ) {}

    async getPigState(): Promise<string> {
        const pigObject = await this.pigImageStatus.findOne()
        if (!pigObject) {
            throw new Error('Pig state not found');
        }
        return pigObject.current_status;
    }

    async updatePigStatus(status: string): Promise<string> {
      await this.pigImageStatus.updateOne(
          {},
          { 
            $set: { 
            current_status: status, 
            updated_at: new Date() 
            } 
          },
        );
      
        if (status === 'happy') {
          setTimeout(async () => {
            await this.pigImageStatus.updateOne(
              {},
              { $set: { current_status: 'neutral', updated_at: new Date() } },
            );
          }, 2500);
        }
      
        return this.getCurrentPigStatus();
    }


    private async getCurrentPigStatus(): Promise<string> {
      const pig = await this.pigImageStatus.findOne().exec();
      if (!pig) {
        throw new Error('Pig not found');
      }
      return pig.current_status;
    }


    async handlePigCreation(animal: Animal): Promise<void> {
      if (animal.type === 'Pig') {
  
        await this.pigImageStatus.create({
          pig_id: animal._id,
          current_status: 'neutral',
          updated_at: new Date(),
        });
        
      }
    }
    

    async triggerPutinState(): Promise<string> {
        const pigState = await this.pigImageStatus.findOne();
        if (!pigState) {
            throw new Error('Pig state not found');
        }
        
        const nextState = pigState.current_status === 'putin' ? 'home' : 'putin';
      
        await this.pigImageStatus.updateOne({}, { state: nextState });
      
        return nextState;
    }
}
