import {
  Controller,
  Get,
  UseGuards,
  Post,
  Param,
  Body,
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryDto, UpdateDto, CreateDto } from './dto/gift-card.dto';
import { IGiftCard, IEmptyGiftCard } from './gift-card.interface';
import { GiftCardService } from './gift-card.service';

@Controller('gift-cards')
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Get('preview')
  async getPreviewData(
    @Request() req,
    @Param() query: QueryDto,
  ): Promise<IGiftCard | Record<string, never>> {
    const giftCards = this.giftCardService.read(query);
    if (!giftCards || !giftCards[0]) return {};
    //clear some confident data
    return giftCards[0];
  }

  @Get(':query?')
  @UseGuards(JwtAuthGuard)
  async get(@Request() req, @Param() query?: QueryDto): Promise<IGiftCard[]> {
    return this.giftCardService.read(query);
  }

  @Post('unauth-create')
  async unauthCreate(@Body() dto: CreateDto) {
    await this.giftCardService.create('unauth', dto);
    //send telegram message about gift card creation
    //return giftCardDocument.id;
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req): Promise<string> {
    const giftCardDocument: IEmptyGiftCard = await this.giftCardService.create(
      req.user.username,
      {},
    );
    return giftCardDocument.id;
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() dto: UpdateDto) {
    this.giftCardService.update(dto);
  }
}
