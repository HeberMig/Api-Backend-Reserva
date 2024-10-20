import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Space } from './space.schema';

export type ReservationDocument = Reservation & Document;

@Schema({
  timestamps: true,
})
export class Reservation {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    type: Types.ObjectId,
    ref: 'Space',
    required: true,
  })
  space: Space;

  @Prop({
    required: true,
  })
  reservationDate: Date;

  @Prop({
    required: true,
  })
  startDate: Date;

  @Prop({
    required: true,
  })
  endDate: Date;
  @Prop({
    required: true,
  })
  duration: number;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
