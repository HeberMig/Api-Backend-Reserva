import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from 'src/schemas/reservation.schema';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';


@Module({
  imports:[
  MongooseModule.forFeature([{
    name: Reservation.name, schema: ReservationSchema}]),
  ],
  providers: [ReservaService],
  controllers: [ReservaController]
})
export class ReservaModule {}
