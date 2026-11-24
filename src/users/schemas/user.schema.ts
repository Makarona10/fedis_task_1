import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export interface RefreshToken {
  token: string;
  expiresAt: Date;
}

@Schema({ timestamps: true, toJSON: { virtuals: true, getters: true } })
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  @Prop([
    {
      token: { type: String, required: true },
      expiresAt: { type: Date, required: true },
    },
  ])
  refreshTokens: RefreshToken[];

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
