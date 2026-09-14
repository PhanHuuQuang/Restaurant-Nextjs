import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TOKEN_COOKIE_NAME } from '../auth-cookies';

function cookieExtractor(req: Request): string | null {
  if (req?.cookies?.[TOKEN_COOKIE_NAME]) {
    return req.cookies[TOKEN_COOKIE_NAME];
  }

  const raw = req?.headers?.cookie;
  if (!raw) return null;

  const match = raw
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${TOKEN_COOKIE_NAME}=`));
  if (!match) return null;

  return decodeURIComponent(match.slice(TOKEN_COOKIE_NAME.length + 1)) ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET_KEY'),
    });
  }
  async validate(payload: { sub: number; email: string; role: string }) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
