import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserJwtPayload } from '../../shared/interfaces/userJwtPayload';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private userServices: UsersService, private jwtService: JwtService) {}

  async signin(authCredentialsDto: any): Promise<string> {
    const username: string = authCredentialsDto.email;

    const user = await this.userServices.findOneByEmail(username);

    if (user) {
      const payload: UserJwtPayload = { username };

      const token: string = await this.jwtService.sign(payload);

      return token;
    } else {
      console.log('Incorrect login credentials!');
      throw new UnauthorizedException('Incorrect login credentials!');
    }
  }
}
