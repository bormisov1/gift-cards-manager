import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { config } from '../../../config';

interface JwtPayload {
  username: string;
  password: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // algorithms: ['HS384'],
      secretOrKey: 'a',
      passReqToCallback: true,
    }/* , function (req, jwtPaylad, cakkback) {
      console.log(jwtPaylad)
      // console.log(req)
      cakkback(null, jwtPaylad);
    } */);
  }

  validate(req: Request, payload: any) {
    //username: string, password: string) {
    return payload
    //{ userId: 123, username: username };
  }
}
