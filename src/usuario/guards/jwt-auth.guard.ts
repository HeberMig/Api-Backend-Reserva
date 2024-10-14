import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    getRequest(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request;
    }
}
