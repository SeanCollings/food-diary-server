import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import {
  Controller,
  Put,
  UseGuards,
  Request,
  BadRequestException,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { LinkShareableDto } from './dtos/link-shareable.dto';
import { ShareService } from './share.service';
import { GetSharedSummaryQuery, RequestWithUser } from './types';

@Controller('share')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Get('/')
  async getSharedSummary(@Query() query: GetSharedSummaryQuery) {
    try {
      return await this.shareService.getSharedSummary(
        query.link,
        query.dateFrom,
        query.dateTo,
      );
    } catch (err) {
      console.error('[Share:/]:', err.message);
      throw new BadRequestException();
    }
  }

  @Put('/generate-link')
  @UseGuards(JwtAuthGuard)
  async generateShareLink(@Request() req: RequestWithUser) {
    try {
      return await this.shareService.generateShareLink(req.user.userId);
    } catch (err) {
      console.error('[Share:generate-link]:', err.message);
      throw new BadRequestException();
    }
  }

  @Put('/link-shareable')
  @UseGuards(JwtAuthGuard)
  async linkShareable(
    @Request() req: RequestWithUser,
    @Body() body: LinkShareableDto,
  ) {
    try {
      return await this.shareService.linkShareable(
        req.user.userId,
        body.isShared,
      );
    } catch (err) {
      console.error('[Share:link-shareable]:', err.message);
      throw new BadRequestException();
    }
  }
}
