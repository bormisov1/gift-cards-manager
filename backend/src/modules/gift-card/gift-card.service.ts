import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import QRCode from 'qrcode';
import path from 'path';
import cryptoJs from 'crypto-js';

import { GiftCard, GiftCardDocument } from './schemas/gift-card.schema';
import {
  IQuery,
  IUpdateDto,
  IGiftCardStorage,
  IGiftCard,
  IEmptyGiftCard,
  ICreateDto,
  //ICreateDto,
} from './gift-card.interface';
import { config } from '../../config';

@Injectable()
export class GiftCardService implements IGiftCardStorage {
  constructor(
    @InjectModel(GiftCard.name)
    private giftCardModel: Model<GiftCardDocument>,
  ) {}

  async read(query: IQuery): Promise<IGiftCard[]> {
    return await this.giftCardModel.find(query).exec();
  }

  async create(
    username: string, dto: ICreateDto
  ):Promise<IEmptyGiftCard> {
    const creationDate: Date = new Date();
    const nextYear = new Date(
      creationDate.setFullYear(creationDate.getFullYear() + 1),
    );
    const giftCard: IEmptyGiftCard = {
      ...dto,
      active: username == 'unauth' ? false : true,
      spent: 0,
      creatorUsername: username,
      id: cryptoJs.lib.WordArray.random(6).toString(),
      creationDate,
      expirationDate: new Date(nextYear.setDate(nextYear.getDate() + 1)),
    };
    const pathToFile = path.join(process.cwd(), 'codes', giftCard.id + '.png');
    const link = config.FRONTEND_URL + '/' + giftCard.id;
    return new Promise((resolve) => {
      QRCode.toFile(pathToFile, link, () => {
        this.giftCardModel.create(giftCard);
        resolve(giftCard);
      });
    });
  }

  update(giftCard: IUpdateDto) {
    this.giftCardModel.updateOne(
      { id: giftCard.id },
      { ...giftCard, active: true },
    );
  }
}
