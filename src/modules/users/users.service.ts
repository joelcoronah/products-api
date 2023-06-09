import { Injectable, HttpException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserFirebase } from './user.firebase.service';
import * as ResponseMessage from './response.messages';
import { UserLoginResponse } from './interfaces';
import { QueryParams, paginateResponse } from '../../shared/interfaces/paginate';

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
      password: createUserDto.password,
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

  async findAll(query: QueryParams): Promise<any> {
    const limit = query.limit || 10;
    const firstName = query.firstName || '';

    const page = query.page || 1;

    const offset = (page - 1) * limit;

    const data = await this.userRepository.findAndCount({
      where: { firstName: Like('%' + firstName + '%'), deletedAt: IsNull() },
      order: { firstName: 'DESC' },
      take: limit,
      skip: offset,
    });

    return paginateResponse(data, page, limit);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findOneByAuthId(authId: string) {
    return this.userRepository.findOne({ where: { authId } });
  }
  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException(ResponseMessage.NOT_FOUND.message, ResponseMessage.NOT_FOUND.status);
    }

    const userUpdated = this.userRepository.save({ ...user, ...updateUserDto });

    return userUpdated;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException(ResponseMessage.NOT_FOUND.message, ResponseMessage.NOT_FOUND.status);
    }

    const userUpdated = await this.userRepository.save({ ...user, deletedAt: new Date() });

    console.log(userUpdated);

    if (userUpdated) {
      await this.firebaseService.removeFirebaseUser(user.email);
    }

    return userUpdated;
  }
}
