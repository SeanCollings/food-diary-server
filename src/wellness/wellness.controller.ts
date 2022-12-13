import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';
import { RequestWithUser } from '@/wellness/types';
import {
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { WellnessEntryDto } from './dtos/wellness-entry.dto';
import { WellnessService } from './wellness.service';

@Controller('wellness')
export class WellnessController {
  constructor(private wellnessService: WellnessService) {}

  @Put('/')
  @UseGuards(JwtAuthGuard)
  async updateWellnessEntries(
    @Request() req: RequestWithUser,
    @Body() body: WellnessEntryDto,
  ) {
    try {
      return this.wellnessService.updateWellnessEntries(
        req.user.userId,
        body.data,
      );
    } catch (err) {
      console.error('[wellness::_put_]:', err.message);
      throw new InternalServerErrorException(err.message || DEFAULT_ERROR_MSG);
    }
  }
}
