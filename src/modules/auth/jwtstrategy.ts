import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { UserJwtPayload } from '../../shared/interfaces/userJwtPayload';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userServices: UsersService, private configService: ConfigService) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: UserJwtPayload): Promise<User> {
    console.log({ payload });
    const { username } = payload;

    const user: User = await this.userServices.findOneByEmail(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
