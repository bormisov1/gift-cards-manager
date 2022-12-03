import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  passHash: string;

  @Prop()
  salt: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
