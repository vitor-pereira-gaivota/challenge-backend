import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PeopleData {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  documentNumber: string;
}

class localData {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number;
}

export class CreateClientDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  clientTypeId: number;

  @ApiProperty({ type: () => PeopleData, isArray: true })
  @Type(() => PeopleData)
  @ValidateNested({ each: true })
  peoples: PeopleData[];

  @ApiProperty({ type: () => localData, isArray: true })
  @Type(() => localData)
  @ValidateNested({ each: true })
  locals: localData[];
}
