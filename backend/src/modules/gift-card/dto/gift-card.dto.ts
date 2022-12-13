import { ApiProperty } from '@nestjs/swagger';
import {
  //  IsArray,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsBoolean,
  IsString,
  //  ValidateNested,
} from 'class-validator';
//import { plainToClass, Transform, Type } from 'class-transformer';
import {
  ICreateDto,
  IDescription,
  IQuery,
  IUpdateDto,
  IActivateDto,
} from '../gift-card.interface';

export class CreateDto implements ICreateDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  sum: number;

  @ApiProperty({ type: Object })
  @IsObject()
  @IsNotEmpty()
  description: IDescription;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  spent?: number;
}

export class QueryDto implements IQuery {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  id?: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  active?: boolean;
}

export class UpdateDto implements IUpdateDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  spent: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  sum?: number;

  @ApiProperty({ type: Object })
  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  description?: IDescription;
}

export class ActivateDto implements IActivateDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  spent?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  sum?: number;

  @ApiProperty({ type: Object })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
