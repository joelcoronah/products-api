import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserJwtPayload } from '../../shared/interfaces/userJwtPayload';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private userServices: UsersService, private jwtService: JwtService) {}

  async signin(authCredentialsDto: any): Promise<{ token: string }> {
    const username: string = authCredentialsDto.username;

    const user = await this.userServices.findOneByEmail(authCredentialsDto.username);

    if (user) {
      const payload: UserJwtPayload = { username };

      const token: string = await this.jwtService.sign(payload);

      return { token };
    } else {
      throw new UnauthorizedException('Incorrect login credentials!');
    }
  }
}
