import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateClientDto } from './create-client.dto';

class PeopleData {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({ required: false })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  documentNumber: string;
}

class localData {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number;

  @ApiProperty({ required: false })
  @IsString()
  name: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiProperty({ type: () => PeopleData, isArray: true })
  @Type(() => PeopleData)
  @ValidateNested({ each: true })
  peoples: PeopleData[];

  @ApiProperty({ type: () => localData, isArray: true })
  @Type(() => localData)
  @ValidateNested({ each: true })
  locals: localData[];
}
