import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { RequestWithUser } from '@/wellness/types';
import { Body, Controller, Put, Request, UseGuards } from '@nestjs/common';
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
    return this.wellnessService.updateWellnessEntries(
      req.user.userId,
      body.data,
    );
  }
}
