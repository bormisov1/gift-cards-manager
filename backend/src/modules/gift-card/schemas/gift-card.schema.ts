import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IDescription } from '../gift-card.interface';

@Schema()
export class GiftCard {
  @Prop()
  id: string;

  @Prop()
  creatorUsername: string;

  @Prop({type: Object})
  description: object;

  @Prop()
  sum: number;

  @Prop()
  spent: number;

  @Prop()
  active: boolean;

  @Prop()
  creationDate: Date;

  @Prop()
  expirationDate: Date;
}

export type GiftCardDocument = GiftCard & Document;
export const GiftCardSchema = SchemaFactory.createForClass(GiftCard);
