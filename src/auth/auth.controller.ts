import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LocalAuthGuard } from '@/auth//local-auth.guard';
import { RequestWithUser } from './types';
import { CreateUserDTO, LoginUserDTO, ResetPasswordDto } from './dtos';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { UserDto } from '@/users/dtos';
import { AxiosError } from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @Serialize(UserDto)
  async createUser(@Body() body: CreateUserDTO) {
    try {
      return await this.authService.signup(body);
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.message || DEFAULT_ERROR_MSG;
      console.error('[auth::_post_signup]:', errorMessage);

      if (error.status === 409) {
        throw error;
      }

      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: RequestWithUser, @Body() body: LoginUserDTO) {
    try {
      const { id, email } = req.user;
      return await this.authService.login({ id, email, token: body.token });
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[auth::_post_login]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Post('/reset')
  async resetPassword(@Body() body: ResetPasswordDto) {
    try {
      const { email, token } = body;
      return await this.authService.resetPassword({ email, token });
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[auth::_post_reset]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
