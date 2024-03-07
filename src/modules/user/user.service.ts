import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import appError from 'src/common/constants/errors';

@Injectable()
export class UserService {
  users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll():Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User> {
    const searchUser = this.users.find((user) => user.id === id);
    if (!searchUser) {
      throw new NotFoundException(appError.USER_ID_NOT_EXIST)
    };
    return searchUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
