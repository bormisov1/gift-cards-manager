import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { IUser } from './auth.interface';
import { AuthService } from './auth.service';
import { UserDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Body() dto: UserDto) {
    const result = this.authService.register(dto);
    if (!result) {
      //TODO throw err
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  async login(@Body() user: UserDto): Promise<IUser> {
    return user;
  }
}
