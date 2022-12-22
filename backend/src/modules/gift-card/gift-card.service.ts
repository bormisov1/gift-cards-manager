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
  IFixedGiftCard,
  IEmptyGiftCard,
  IEmptyFixedGiftCard,
  ICreateDto,
  IFixedCreateDto,
  IGiftCardInfo,
  IFixedGiftCardInfo,
  IDescription,
  IActivateGiftCard,
  IActivateDto,
} from './gift-card.interface';
import { config } from '../../config';

@Injectable()
export class GiftCardService implements IGiftCardStorage {
  constructor(
    @InjectModel(GiftCard.name)
    private giftCardModel: Model<GiftCardDocument>,
  ) {}

  async read(id: string): Promise<IGiftCard | IFixedGiftCard> {
    return await this.giftCardModel.findOne({ id }).select('-_id -v').exec();
  }

  async getList(
    query: IQuery,
  ): Promise<(IGiftCardInfo | IFixedGiftCardInfo)[]> {
    const giftCards = await this.giftCardModel
      .find(query)
      .select(
        'description creatorUsername spent sum id active isService service',
      )
      .exec();
    return giftCards.map((giftCard) => {
      const description = giftCard.description as IDescription;
      return {
        id: giftCard.id,
        creatorUsername: giftCard.creatorUsername,
        receiverFullName: description.receiver.fullName,
        sum: giftCard.sum,
        spent: giftCard.spent,
        active: giftCard.active,
        isService: giftCard.isService,
        service: giftCard.service,
      };
    });
  }

  async create(
    username: string,
    dto: ICreateDto | IFixedCreateDto,
  ): Promise<IEmptyGiftCard | IEmptyFixedGiftCard> {
    const creationDate: Date = new Date();
    const nextYear = new Date(
      new Date().setFullYear(creationDate.getFullYear() + 1),
    );
    const id = randomBytes(8)
      .toString('base64')
      .replace(/\//g, '_')
      .replace(/\+/g, '-');
    const giftCard: IEmptyGiftCard | IEmptyFixedGiftCard = {
      ...dto,
      active: username == '' ? false : true,
      spent: 0,
      creatorUsername: username,
      id: btoa(id),
      creationDate,
    };
    if (username != '') {
      giftCard.activationDate = new Date();
      giftCard.expirationDate = new Date(
        nextYear.setDate(nextYear.getDate() + 1),
      );
    }
    const pathToFile = path.join(process.cwd(), 'codes', giftCard.id + '.png');
    const link = config.FRONTEND_URL + '/gift-card/' + giftCard.id;
    const createDoc = async (resolve) => {
      this.giftCardModel.create(giftCard);
      resolve(giftCard);
    };
    return new Promise((resolve) => {
      if (giftCard.active) {
        QRCode.toFile(
          pathToFile,
          link,
          {
            width: 300,
            margin: 2,
            color: {
              light: '#0000',
            },
          },
          (err) => {
            if (err) {
              //TODO error
            }
            createDoc(resolve);
          },
        );
      } else {
        createDoc(resolve);
      }
    });
  }

  async update(giftCard: IUpdateDto) {
    const oldValue: IGiftCard | IFixedGiftCard = await this.giftCardModel
      .findOne({ id: giftCard.id })
      .select('-_id -v')
      .exec();
    let active = oldValue.active;
    const spent = (oldValue.spent || 0) + giftCard.spent;
    if ((oldValue.isService && giftCard.spent) || spent >= +oldValue.sum) {
      active = false;
    }
    await this.giftCardModel.findOneAndUpdate(
      { id: giftCard.id },
      { spent, active },
    );
  }

  async activate(giftCard: IActivateDto) {
    const oldValue: IGiftCard | IFixedGiftCard = await this.giftCardModel
      .findOne({ id: giftCard.id })
      .select('-_id -v')
      .lean()
      .exec();
    const update: IActivateGiftCard = {
      spent: giftCard.spent ? (oldValue.spent || 0) + giftCard.spent : 0,
      active: giftCard.active !== null ? giftCard.active : oldValue.active,
    };
    if (giftCard.active) update.sum = giftCard.sum;
    if (!oldValue.activationDate && giftCard.active) {
      const today: Date = new Date();
      const nextYear = new Date(
        new Date().setFullYear(today.getFullYear() + 1),
      );
      update.activationDate = new Date();
      update.expirationDate = new Date(
        nextYear.setDate(nextYear.getDate() + 1),
      );
    }
    const pathToFile = path.join(process.cwd(), 'codes', giftCard.id + '.png');
    const updateDoc = (resolve) => {
      this.giftCardModel.findOneAndUpdate({ id: giftCard.id }, update, () => {
        resolve('');
      });
    };
    await new Promise((resolve) => {
      if (giftCard.active) {
        const link = config.FRONTEND_URL + '/' + giftCard.id;
        QRCode.toFile(pathToFile, link, { width: 300, margin: 2 }, (err) => {
          if (err) {
            //TODO error
          }
          updateDoc(resolve);
        });
      } else updateDoc(resolve);
    });
  }
}
