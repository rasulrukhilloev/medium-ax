import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'access_token_secret', //TODO .env
    });
  }

  //TODO add payload type dto
  validate(payload: any) {
    return this.databaseService.user.findUnique({
      where: { id: payload.sub },
    });
  }
}
