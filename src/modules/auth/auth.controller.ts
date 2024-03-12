import {
  Controller,
  Post,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from './decorators/public.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  async signup(@Body() dto: SignupAuthDto) {
    return await this.authService.signup(dto);
  }

  @Post('login')
  @Public()
  async login(@Body() dto: LoginAuthDto) {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  async refresh(@Body() dto: RefreshAuthDto) {
    return await this.authService.refresh(dto);
  }
}
