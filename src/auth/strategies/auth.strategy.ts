import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.temporarytoken || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.TEMPORARY_TOKEN ?? 'ff',
    });
  }

  async validate(payload: any) {
    return payload.id;
  }
}
