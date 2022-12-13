import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as QRCode from 'qrcode';
import * as path from 'path';
import * as fs from 'fs';
import { randomBytes } from 'crypto';

import { GiftCard, GiftCardDocument } from './schemas/gift-card.schema';
import {
  IQuery,
  IUpdateDto,
  IGiftCardStorage,
  IGiftCard,
  IEmptyGiftCard,
  ICreateDto,
  IGiftCardInfo,
  IDescription,
} from './gift-card.interface';
import { config } from '../../config';

@Injectable()
export class GiftCardService implements IGiftCardStorage {
  constructor(
    @InjectModel(GiftCard.name)
    private giftCardModel: Model<GiftCardDocument>,
  ) {}

  async read(id: String): Promise<IGiftCard> {
    return await this.giftCardModel.findOne({id}).select('-_id -v').exec();
  }

  async getList(query: IQuery): Promise<IGiftCardInfo[]> {
    const giftCards = await this.giftCardModel
      .find(query)
      .select('description creatorUsername spent sum id active')
      .exec(); 
    return giftCards.map(giftCard => {
      const description = giftCard.description as IDescription
      return {
        id: giftCard.id,
        creatorUsername: giftCard.creatorUsername,
        receiverFullName: description.receiver.fullName,
        sum: giftCard.sum,
        spent: giftCard.spent,
        active: giftCard.active
      }
    })
  }

  async create(
    username: string, dto: ICreateDto
  ):Promise<IEmptyGiftCard> {
    const creationDate: Date = new Date();
    const nextYear = new Date(
      new Date().setFullYear(creationDate.getFullYear() + 1),
    );
    const id = randomBytes(8).toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
    const giftCard: IEmptyGiftCard = {
      ...dto,
      active: username == 'unauth' ? false : true,
      spent: 0,
      creatorUsername: username,
      id: btoa(id),
      creationDate,
    };
    if (username != 'unauth') {
      giftCard.activationDate = new Date();
      giftCard.expirationDate = new Date(nextYear.setDate(nextYear.getDate() + 1))
    }
    const pathToFile = path.join(process.cwd(), 'codes', giftCard.id + '.png');
    const link = config.FRONTEND_URL + '/' + giftCard.id;
    const createDoc = (resolve) => {
      this.giftCardModel.create(giftCard);
      resolve(giftCard);
    }
    return new Promise((resolve) => {
      if (giftCard.active) {
        QRCode.toFile(pathToFile, link, {
          width: 300,
          margin: 2, color: {
            light:"#0000"
          }}, (err) => {
          if (err) {
            //TODO error
          };
          createDoc(resolve)
        })
      } else {
        createDoc(resolve)
      }
    });
  }

  async update(giftCard: IUpdateDto) {
    const oldValue: IGiftCard = await this.giftCardModel
      .findOne({id: giftCard.id})
      .select('-_id -v').exec();
    await this.giftCardModel.findOneAndUpdate(
      { id: giftCard.id },
      {spent: (oldValue.spent || 0) + giftCard.spent},
    );
  }
  }
}
