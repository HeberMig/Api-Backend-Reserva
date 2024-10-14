import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { config } from 'dotenv';

config();

@Module({
  imports: [//se le dice con que schema va interactur el module
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      //secret: '',
      secret: process.env.SECRET_KEY || 'default_secret',
      signOptions: { expiresIn: '30d'}
    }),
    PassportModule.register({ defaultStrategy: 'jwt'}),//linea paraa jwt 02-10
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, JwtStrategy],
})
export class UsuarioModule {}
