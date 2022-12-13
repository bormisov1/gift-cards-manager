import {
  Controller,
  Get,
  UseGuards,
  Post,
  Param,
  Body,
  Request,
  Query
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryDto, UpdateDto, CreateDto, ActivateDto } from './dto/gift-card.dto';
import { IGiftCard, IEmptyGiftCard, IGiftCardInfo } from './gift-card.interface';
import { GiftCardService } from './gift-card.service';

@Controller('gift-cards')
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Get('preview/:id')
  async getPreviewData(
    @Request() req,
    @Param('id') id: string,
  ): Promise<IGiftCard | Record<string, never>> {
    const giftCard = this.giftCardService.read(id);
    return giftCard;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getList(@Request() req, @Query() query?: QueryDto): Promise<IGiftCardInfo[]> {
    return this.giftCardService.getList(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(@Request() req, @Param('id') id: string): Promise<IGiftCard> {
    return this.giftCardService.read(id);
  }

  @Post('unauth-create')
  async unauthCreate(@Body() dto: CreateDto) {
    await this.giftCardService.create('unauth', dto);
    return {ok: true}
    //send telegram message about gift card creation
    //return giftCardDocument.id;
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() dto: CreateDto): Promise<string> {
    const giftCardDocument: IEmptyGiftCard = await this.giftCardService.create(
      req.user.username,
      dto,
    );
    if (!giftCardDocument) {
      //TODO return error
    }
    return giftCardDocument.id;
  }

  @Post('activate')
  @UseGuards(JwtAuthGuard)
  async activate(@Request() req, @Body() dto: ActivateDto) {
    this.giftCardService.activate(dto);
    return {ok: true}
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() dto: UpdateDto) {
    this.giftCardService.update(dto);
    return {ok: true}
  }
}
