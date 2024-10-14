import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config} from 'dotenv'
import { ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';
//cargar var ent
config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  //Conexion db mongoose
  const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/reservadb';
  
  mongoose.connect(dbUri)
    .then(() => {
      console.log('Conectado a la base de datos MongoDB');
    })
    .catch(err => {
      console.error('Error al conectar a la base de datos MongoDB', err);
    });


  const port = process.env.PORT || 3000;
  //await app.listen(3000);
  await app.listen(port)
  console.log(`El servidor es corriendo el puerto ${port}`);

}
bootstrap();
