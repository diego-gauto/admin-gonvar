import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { environment } from 'src/config/environment';

const extractJwtWithLogging = (req) => {
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  console.log('Token extraído:', token); // Imprime el token
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractJwtWithLogging,
      ignoreExpiration: false,
      secretOrKey: environment().JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { user_id: payload.sub, email: payload.email };
  }
}
