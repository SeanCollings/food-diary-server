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
  getUserProfile(@Request() req: RequestWithUser) {
    try {
      const { userId } = req.user;

      return this.usersService.getUserProfile(userId);
    } catch (err) {
      console.error('[user::_get_profile]:', err.message);
      throw new InternalServerErrorException(err.message || DEFAULT_ERROR_MSG);
    }
  }

  @Patch('/')
  @UseGuards(JwtAuthGuard)
  updateUser(@Body() body: UpdateUserDTO, @Request() req: RequestWithUser) {
    try {
      return this.usersService.updateUser(req.user.userId, body);
    } catch (err) {
      console.error('[user::_patch_]:', err.message);
      throw new InternalServerErrorException(err.message || DEFAULT_ERROR_MSG);
    }
  }

  @Patch('/preferences')
  @UseGuards(JwtAuthGuard)
  updateUserPreferences(
    @Body() body: UpdatePreferencesDTO,
    @Request() req: RequestWithUser,
  ) {
    try {
      return this.usersService.updateUserPreferences(req.user.userId, body);
    } catch (err) {
      console.error('[user::_patch_preferences]:', err.message);
      throw new InternalServerErrorException(err.message || DEFAULT_ERROR_MSG);
    }
  }
}
