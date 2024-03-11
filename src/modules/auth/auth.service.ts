import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import appError from 'src/common/constants/errors';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configServise: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, +this.configServise.get('cript_salt'));
    } catch (e) {
      throw new Error(e);
    }
  }

  private async generateToken(
    userId: User['id'],
    login: User['login'],
  ): Promise<Token> {
    const payload = { userId, login };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configServise.get('secret_key_jwt'),
      expiresIn: this.configServise.get('expire_token'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configServise.get('secret_refresh_key_jwt'),
      expiresIn: this.configServise.get('expire_refresh_token'),
    });

    return { userId, login, accessToken, refreshToken };
  }

  private async refreshToken(
    refreshToken: RefreshAuthDto['refreshToken'],
  ): Promise<Token> {
    try {
      const verify = await this.jwtService.verify(refreshToken, {
        secret: this.configServise.get('secret_refresh_key_jwt'),
      });

      const { userId, login, exp } = verify;

      if (Date.now() >= exp * 1000) {
        throw new ForbiddenException(appError.REFRESH_TOKEN_EXP);
      }

      const user = await this.userService.getUserByID(userId);
      if (!user) throw new Error();

      return await this.generateToken(userId, login);
    } catch (e) {
      throw new ForbiddenException(appError.INVALID_TOKEN);
    }
  }

  async signup(dto: SignupAuthDto): Promise<Omit<User, "password">>{
    const existUser = await this.userService.getUserByLogin(dto.login);

    if (existUser) {
      throw new BadRequestException(appError.USER_EXIST);
    }

    const hashPassword = await this.hashPassword(dto.password);

    const user: CreateUserDto = {
      login: dto.login,
      password: hashPassword,
    };

    return await this.userService.create(user);
  }

  async login(dto: LoginAuthDto): Promise<Token> {
    const existUser = await this.userService.getUserByLogin(dto.login);
    if (!existUser) {
      throw new ForbiddenException(appError.USER_NOT_EXIST);
    }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      existUser.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException(appError.WRONG_DATA);
    }

    return await this.generateToken(existUser.id, existUser.login);
  }

  async refresh(dto: RefreshAuthDto): Promise<Token> {
    const refreshToken = dto.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }
    return this.refreshToken(refreshToken);
  }
}
