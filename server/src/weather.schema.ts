import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Weather extends Document {
  @Prop({ required: true })
  city: string;

  @Prop({ type: Object })
  weatherData: any;

  @Prop()
  createdAt: Date;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);