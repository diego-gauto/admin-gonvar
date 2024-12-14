// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}
//TODO: intentar que funcione con jwt strategy. Si no se puede eliminar las dependencias
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IAuthTokenResult, IUseToken } from '../dto/IAuth.types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'Public',
      context.getHandler(),
    );

    console.log(isPublic, 'dentro del JwtAuthGuard');

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    console.log('Request Headers:', request.headers);
    console.log('Request Method:', request.method);
    console.log('Request URL:', request.url);
    const token = request.headers.authorization?.split(' ')[1]; // Obtén el token
    console.log(token);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    const manageToken: IUseToken | string = this.useToken(token);
    console.log('luego del useToken');

    console.log('Manage Token:', manageToken);
    console.log(typeof manageToken);
    if (typeof manageToken === 'object') {
      console.log('al comienzo del if');
      console.log(manageToken.sub);
      console.log(manageToken.role);
      console.log(manageToken.isExpired);

      console.log('al final del if');
    }
    if (typeof manageToken === 'string')
      throw new UnauthorizedException(manageToken);

    if (manageToken.isExpired) throw new UnauthorizedException('expired token');

    const { sub, role } = manageToken;

    console.log('antes del getUSerById');
    const user = await this.userService.getUserById(sub);
    console.log(user, 'linea 68');

    if (!user) throw new UnauthorizedException('Invalid user');

    request.userId = sub;
    request.role = role;

    console.log('antes del return true');
    return true;
  }

  private useToken = (token: string): IUseToken | string => {
    try {
      const decoded = this.jwtService.decode(token) as IAuthTokenResult;

      const currentDate = Math.floor(Date.now() / 1000);
      const expiredDate = decoded.exp;

      console.log('Decoded JWT:', decoded);

      return {
        sub: decoded.sub,
        role: decoded.role,
        isExpired: +expiredDate <= +currentDate,
      };
    } catch (error) {
      return 'Invalid token';
    }
  };
}
