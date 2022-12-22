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

  @Prop({ type: Object })
  description: IDescription;

  @Prop()
  sum: number;

  @Prop()
  service: string;

  @Prop()
  isService: boolean;

  @Prop()
  spent: number;

  @Prop()
  active: boolean;

  @Prop()
  creationDate: Date;

  @Prop()
  expirationDate: Date;

  @Prop()
  activationDate: Date;
}

export type GiftCardDocument = GiftCard & Document;
export const GiftCardSchema = SchemaFactory.createForClass(GiftCard);
