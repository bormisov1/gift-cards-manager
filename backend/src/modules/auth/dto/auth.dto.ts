import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDefined } from 'class-validator';
//import { plainToClass, Transform, Type } from 'class-transformer';
import { IUser } from '../auth.interface';

export class UserDto implements IUser {
  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;
}
