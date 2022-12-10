import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  username: string;

  @Prop()
  passHash: string;

  @Prop()
  salt: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
