import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioService } from './usuario.service';
import { User } from '../schemas/user.schema';
import { config } from 'dotenv';

config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usuarioService: UsuarioService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //ignoreExpiration:false,
      //secretOrKey: '',
      secretOrKey: process.env.SECRET_KEY || 'default_secret',
    });
  }
  async validate(payload: any): Promise<User> {
    console.log('Payload en validate: ', payload);
    const user = await this.usuarioService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('No se puede validar el token');
    }
    return user; // Esto debería establecer req.user
  }
}
