import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftCardController } from './gift-card.controller';
import { GiftCardService } from './gift-card.service';
import { GiftCard, GiftCardSchema } from './schemas/gift-card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GiftCard.name, schema: GiftCardSchema },
    ]),
  ],
  controllers: [GiftCardController],
  providers: [GiftCardService],
})
export class GiftCardsModule {}
