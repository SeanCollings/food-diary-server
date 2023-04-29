import {
  Patch,
  Controller,
  Body,
  Get,
  Request,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UpdateUserDTO, UpdatePreferencesDTO } from './dtos';
import { RequestWithUser } from './types';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/profile')
  @Serialize(UserDto)
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Request() req: RequestWithUser) {
    try {
      const { userId } = req.user;

      return await this.usersService.getUserProfile(userId);
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[user::_get_profile]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Patch('/')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Request() req: RequestWithUser,
    @Body() body: UpdateUserDTO,
  ) {
    try {
      return await this.usersService.updateUser(req.user.userId, body);
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[user::_patch_]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Patch('/preferences')
  @UseGuards(JwtAuthGuard)
  async updateUserPreferences(
    @Request() req: RequestWithUser,
    @Body() body: UpdatePreferencesDTO,
  ) {
    try {
      return await this.usersService.updateUserPreferences(
        req.user.userId,
        body,
      );
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[user::_patch_preferences]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
