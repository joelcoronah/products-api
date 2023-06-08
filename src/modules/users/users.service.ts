import { Injectable, HttpException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserFirebase } from './user.firebase.service';
import * as ResponseMessage from './response.messages';
import { UserLoginResponse } from './interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly firebaseService: UserFirebase,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const firebaseUser = await this.firebaseService.createFirebaseUser({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
    });
    const newUser = await this.userRepository
      .save({
        ...createUserDto,
        authId: firebaseUser.uid,
      })
      .catch(async ({ message }) => {
        await this.firebaseService.removeFirebaseUser(createUserDto.email);
        const responseMessage = ResponseMessage.INTERNAL_SERVER_ERROR(message);
        throw new HttpException(responseMessage.message, responseMessage.status);
      });

    return newUser;
  }

  async setLastLogin(authId: string): Promise<UserLoginResponse> {
    const user = await this.userRepository.findOne({ where: { authId } }).catch(({ message }) => {
      const responseMessage = ResponseMessage.INTERNAL_SERVER_ERROR(message);
      throw new HttpException(responseMessage.message, responseMessage.status);
    });

    if (!user) {
      throw new HttpException(ResponseMessage.NOT_FOUND.message, ResponseMessage.NOT_FOUND.status);
    }

    const firstLogin = user.lastLogin === null;

    user.lastLogin = new Date();

    const userUpdated = await this.userRepository.save(user);

    return { ...userUpdated, firstLogin };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
