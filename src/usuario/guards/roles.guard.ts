import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../schemas/user.schema'; // Ajusta la ruta según sea necesario

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // Suponiendo que el usuario se agrega al request después de la autenticación
    
    console.log("usuario en rolesguard", user);

    if (!user || !requiredRoles.includes(user.rol)) {
      throw new ForbiddenException('No tienes permiso para acceder a este recurso');
    }
    return true;
  }
}
