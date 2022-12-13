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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDTO) {
    try {
      return await this.authService.signup(body);
    } catch (err) {
      console.error('[auth::_post_signup]:', err.message);
      throw new InternalServerErrorException(err.message || DEFAULT_ERROR_MSG);
    }
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: RequestWithUser, @Body() body: LoginUserDTO) {
    try {
      const { id, email } = req?.user || {};
      return await this.authService.login({ id, email, token: body.token });
    } catch (err) {
      console.error('[auth::_post_login]:', err.message);
      throw new InternalServerErrorException(err.message || DEFAULT_ERROR_MSG);
    }
  }

  @Post('/reset')
  async resetPassword(@Body() body: ResetPasswordDto) {
    try {
      const { email, token } = body;
      return await this.authService.resetPassword({ email, token });
    } catch (err) {
      console.error('[auth::_post_reset]:', err.message);
      throw new InternalServerErrorException(err.message || DEFAULT_ERROR_MSG);
    }
  }
}
