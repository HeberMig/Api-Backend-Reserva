import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReservaDocument = Reserva & Document;

@Schema()
export class Reserva {
  @Prop({ required: true })
  espacioId: string; // Referencia al espacio

  @Prop({ required: true })
  usuarioId: string; // Referencia al usuario

  @Prop({ required: true })
  fecha: Date;

  @Prop({ required: true })
  horaInicio: string;

  @Prop({ required: true })
  horaFin: string;
}

export const ReservaSchema = SchemaFactory.createForClass(Reserva);
