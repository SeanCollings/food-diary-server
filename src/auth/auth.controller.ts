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
import { CreateUserDTO, LoginUserDTO, ResetPasswordDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDTO) {
    try {
      return await this.authService.signup(body);
    } catch (err) {
      console.error('[auth::signup]::', err.message);
      throw new BadRequestException(err.message || 'Something went wrong');
    }
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: RequestWithUser, @Body() body: LoginUserDTO) {
    try {
      const { id, email } = req?.user || {};
      return await this.authService.login({ id, email, token: body.token });
    } catch (err) {
      console.error('[auth::login]::', err.message);
      throw new BadRequestException(err.message || 'Something went wrong');
    }
  }

  @Post('/reset')
  async resetPassword(@Body() body: ResetPasswordDto) {
    try {
      const { email, token } = body;
      return await this.authService.resetPassword({ email, token });
    } catch (err) {
      console.error('[auth::reset]::', err.message);
      throw new BadRequestException(err.message || 'Something went wrong');
    }
  }
}
