import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import appError from 'src/common/constants/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByID(id: string): Promise<User> {
    const searchUser = await this.userRepository.findOneBy({ id });
    if (!searchUser) {
      throw new NotFoundException(appError.USER_ID_NOT_EXIST);
    }
    return searchUser;
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const createUser = await this.userRepository.save(dto);
    delete createUser.password;
    return createUser;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return await this.userRepository.find({
      select: ['id', 'login', 'version', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const searchUser = await this.getUserByID(id);
    delete searchUser.password;
    return searchUser;
  }

  async update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const searchUser = await this.getUserByID(id);
    if (dto.oldPassword !== searchUser.password) {
      throw new ForbiddenException(appError.UPDATE_USER_PASSWORD_INVALID);
    }

    const updatedUser = {
      ...searchUser,
      password: dto.newPassword,
    };

    await this.userRepository.save(updatedUser);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.getUserByID(id);
    await this.userRepository.delete(id);
  }
}
