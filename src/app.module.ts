import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservaModule } from './reserva/reserva.module';
import { UsuarioModule } from './usuario/usuario.module';
import { EspacioModule } from './espacio/espacio.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    //MongooseModule.forRoot('mongodb'), 
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/reservadb'),
    ReservaModule,
    UsuarioModule, 
    EspacioModule, 
    AutenticacionModule],
})
export class AppModule {}
