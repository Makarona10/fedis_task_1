import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResourceDocument = Resource & Document;

export enum ResourceType {
  MEETING = 'MEETING_ROOM',
  CONFERENCE = 'CONFERENCE_ROOM',
  TRAINING = 'TRAINING_ROOM',
  PRIVATE = 'PRIVATE_OFFICE',
}

export interface OperatingHour {
  openTime: string;
  closeTime: string;
}

@Schema({ timestamps: true })
export class Resource {
  @Prop({ required: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({
    type: String,
    enum: ResourceType,
    required: true,
    index: true,
  })
  type: ResourceType;

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop({ trim: true })
  location: string;

  @Prop({
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
  })
  operatingHours: OperatingHour;

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);

ResourceSchema.index({ name: 'text', type: 1 });
