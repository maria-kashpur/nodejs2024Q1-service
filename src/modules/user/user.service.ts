import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import appError from 'src/common/constants/errors';
import { v4 as uuidv4 } from 'uuid';
import db from 'src/db';

@Injectable()
export class UserService {
  async getUserByID(id: string): Promise<User> {
    const searchUser = db.users.find((user) => user.id === id);
    if (!searchUser) {
      throw new NotFoundException(appError.USER_ID_NOT_EXIST);
    }
    return searchUser;
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user: User = {
      id: uuidv4(),
      ...createUserDto,
      version: 1,
      createdAt: +new Date(),
      updatedAt: +new Date(),
    };
    db.users.push(user);

    const response = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return response;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return db.users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const searchUser = await this.getUserByID(id);
    delete searchUser.password;
    return searchUser;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const searchUser = await this.getUserByID(id);
    if (updateUserDto.oldPassword !== searchUser.password) {
      throw new ForbiddenException(appError.UPDATE_USER_PASSWORD_INVALID);
    }

    const updatedUser = {
      ...searchUser,
      password: updateUserDto.newPassword,
      version: searchUser.version + 1,
      updatedAt: +new Date(),
    };

    db.users = db.users.map((user) => (user.id === id ? updatedUser : user));

    const response = await this.findOne(id);
    return response;
  }

  async remove(id: string): Promise<void> {
    await this.getUserByID(id);
    db.users = db.users.filter((user) => user.id !== id);
  }
}
