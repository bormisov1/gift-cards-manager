import {
  Controller,
  Get,
  UseGuards,
  Post,
  Param,
  Body,
  Request,
  Query,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  QueryDto,
  UpdateDto,
  CreateDto,
  FixedCreateDto,
  ActivateDto,
} from './dto/gift-card.dto';
import {
  IGiftCard,
  IFixedGiftCard,
  IEmptyGiftCard,
  IEmptyFixedGiftCard,
  IGiftCardInfo,
  IFixedGiftCardInfo,
} from './gift-card.interface';
import { GiftCardService } from './gift-card.service';

@Controller('gift-cards')
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Get('preview/:id')
  async getPreviewData(
    @Request() req,
    @Param('id') id: string,
  ): Promise<IGiftCard | IFixedGiftCard | Record<string, never>> {
    const giftCard = this.giftCardService.read(id);
    return giftCard;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getList(
    @Request() req,
    @Query() query?: QueryDto,
  ): Promise<(IGiftCardInfo | IFixedGiftCardInfo)[]> {
    return this.giftCardService.getList(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(
    @Request() req,
    @Param('id') id: string,
  ): Promise<IGiftCard | IFixedGiftCard | Record<string, never>> {
    return this.giftCardService.read(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req,
    @Body() dto: CreateDto | FixedCreateDto,
  ): Promise<string> {
    const giftCardDocument: IEmptyGiftCard | IEmptyFixedGiftCard =
      await this.giftCardService.create(req.user ? req.user.username : '', dto);
    if (!giftCardDocument) {
      //TODO return error
    }
    return giftCardDocument.id;
  }

  @Post('activate')
  @UseGuards(JwtAuthGuard)
  async activate(@Request() req, @Body() dto: ActivateDto) {
    this.giftCardService.activate(dto);
    return { ok: true };
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() dto: UpdateDto) {
    this.giftCardService.update(dto);
    return { ok: true };
  }
}
