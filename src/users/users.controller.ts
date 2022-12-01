import {
  Patch,
  Controller,
  Body,
  Get,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UpdateUserDTO, UpdatePreferencesDTO } from './dtos';
import { RequestWithUser } from './types';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '@/interceptors/serialize.interceptor';

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
      console.error('[Users::profile]:', err.message);
      throw new BadRequestException();
    }
  }

  @Patch('/')
  @UseGuards(JwtAuthGuard)
  updateUser(@Body() body: UpdateUserDTO, @Request() req: RequestWithUser) {
    return this.usersService.updateUser(req.user.userId, body);
  }

  @Patch('/preferences')
  @UseGuards(JwtAuthGuard)
  updateUserPreferences(
    @Body() body: UpdatePreferencesDTO,
    @Request() req: RequestWithUser,
  ) {
    return this.usersService.updateUserPreferences(req.user.userId, body);
  }
}
