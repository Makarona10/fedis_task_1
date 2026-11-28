import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResourceDocument = Resource & Document;

export enum ResourceType {
  MEETING = 'MEETING_ROOM',
  CONFERENCE = 'CONFERENCE_ROOM',
  TRAINING = 'TRAINING_ROOM',
  PRIVATE = 'PRIVATE_OFFICE',
}

export interface OperatingHours {
  openTime: string;
  closeTime: string;
}

@Schema({ timestamps: true })
export class Resource {
  @Prop({ required: true, maxLength: 16, unique: true })
  name: string;

  @Prop({ trim: true, maxLength: 1024 })
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

  @Prop({
    type: {
      openTime: String,
      closeTime: String,
    }, required: true
  })
  operatingHours: OperatingHours;

  @Prop({ type: Boolean, default: true, index: true })
  canReserve: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);

ResourceSchema.index({ name: 'text', type: 1 });
