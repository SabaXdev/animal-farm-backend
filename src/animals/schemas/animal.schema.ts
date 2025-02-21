import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Animal extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: 0 })
  thanks: number;

  @Prop({ default: 'http://localhost:4200/default-animal.jpg' })
  imageUrl: string;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
