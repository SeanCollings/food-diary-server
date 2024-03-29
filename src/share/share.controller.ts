import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';
import {
  Controller,
  Put,
  UseGuards,
  Request,
  InternalServerErrorException,
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
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[share::_get_]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Put('/generate-link')
  @UseGuards(JwtAuthGuard)
  async generateShareLink(@Request() req: RequestWithUser) {
    try {
      return await this.shareService.generateShareLink(req.user.userId);
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[share::_put_generate-link]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
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
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[share::_put_link-shareable]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
