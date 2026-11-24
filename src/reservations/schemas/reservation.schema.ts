import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class Reservation {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Resource',
    required: true,
    index: true,
  })
  resource: Types.ObjectId;

  @Prop({ type: Date, required: true, index: true })
  startDateTime: Date;

  @Prop({ type: Date, required: true, index: true })
  endDateTime: Date;

  @Prop({
    type: String,
    enum: ReservationStatus,
    default: ReservationStatus.CONFIRMED,
    index: true,
  })
  status: ReservationStatus;

  @Prop({ trim: true })
  notes: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.index({
  resource: 1,
  startDateTime: 1,
  endDateTime: 1,
});
