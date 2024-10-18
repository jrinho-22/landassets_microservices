import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';

import { catchError, map, tap } from 'rxjs/operators';
import { AUTH_SERVICE } from '../constants/service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy, private reflector: Reflector,) { }


    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> | any {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        try {
            const request = context.switchToHttp().getRequest();
            const jwt = this.extractTokenFromHeader(request);
            if (!jwt) {
                throw new UnauthorizedException('Authentication not found');
            }
            return this.authClient
                .send('authenticate', {
                    Authentication: jwt,
                })
                .pipe(
                    tap((res) => {
                        request.user = res;
                    }),
                    // map(() => true),
                    catchError(() => throwError(() => new UnauthorizedException('Invalid token'))),
                );
        } catch (error) {
            throw error
        }
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}