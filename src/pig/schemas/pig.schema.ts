import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PigImageStatus extends Document {
  @Prop({ required: true, ref: 'Animal' })
  pig_id: string;
  
  @Prop({ required: true, enum: ['neutral', 'happy', 'putin'], default: 'neutral' })
  current_status: string;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop({ default: 'http://localhost:4200/ღორი_ჩვეულებრივი.jpg' })
  imageUrl: string;
}

export const PigImageStatusSchema = SchemaFactory.createForClass(PigImageStatus);
