import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Space, SpaceSchema } from 'src/schemas/space.schema';
import { EspacioService } from './espacio.service';
import { EspacioController } from './espacio.controller';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name: Space.name, schema: SpaceSchema}]),
  ],
  providers: [EspacioService],
  controllers: [EspacioController]
})
export class EspacioModule {}
