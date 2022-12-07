import { CreateUserDTO } from '@/users/dtos';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LocalAuthGuard } from '@/auth//local-auth.guard';
import { RequestWithUser } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDTO) {
    try {
      return this.authService.signup(body);
    } catch (err) {
      console.error('[auth::signup]::', err.message);
      throw new BadRequestException(err.message || 'Something went wrong');
    }
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: RequestWithUser) {
    const { id, email } = req?.user || {};
    return this.authService.login({ id, email });
  }
}
